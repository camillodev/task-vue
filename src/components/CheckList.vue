<template>
  <div class="checklist">
    <div class="checklist__header">
      <Progress :percent="progress" />
      <a-select
        label-in-value
        :default-value="selectedTemplate"
        class="checklist__template-select">
        <a-select-option
          v-for="item in templates"
          :key="item.key"
          :value="item.key"
          @click="handleChange(item)">
          {{ item.value }}
        </a-select-option>
      </a-select>
      <a-button type="primary">Save as Template</a-button>
    </div>
    <div
      v-for="(_, index) in editableChecklist"
      :key="index"
      class="checklist__item"
      :class="{
        'is-dragging': draggingIndex === index,
        'is-drag-over': dragOverIndex === index,
      }"
      draggable="true"
      @dragstart="drag($event, index)"
      @dragenter="dragEnter($event, index)"
      @dragover="dragOver($event, index)"
      @dragleave="dragLeave"
      @drop="drop($event)"
      @dragend="dragLeave">
      <a-icon type="menu" class="checklist__icon" />
      <a-checkbox
        v-model="editableChecklist[index].checked"
        @change="updateProgress"
        class="checklist-checkbox"></a-checkbox>
      <input
        type="text"
        class="checklist__item-input"
        v-model="editableChecklist[index].text"
        :ref="getRef(index)"
        @blur="saveItem(index)"
        @keyup.enter="saveItemAndAddNew(index)" />
    </div>
  </div>
</template>

<script>
import { Progress } from 'ant-design-vue';

export default {
  name: 'CheckList',
  components: {
    Progress,
  },
  props: {
    checklist: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      editableChecklist: [],
      timeoutId: null,
      refs: {},
      progress: 0,
      draggingIndex: null,
      dragOverIndex: null,

      selectedTemplate: null,
      templates: [
        {
          key: 0,
          value: 'Select Template',
        },
        {
          key: 1,
          value: 'Definition of Done',
          items: [
            {
              checked: false,
              text: 'All acceptance criteria are met',
            },
            {
              checked: false,
              text: 'Code is reviewed and approved',
            },
            {
              checked: false,
              text: 'Unit tests are passing',
            },
          ],
        },
        {
          key: 2,
          value: 'Build Steps',
          items: [
            {
              checked: false,
              text: 'Pull latest code from the repository',
            },
            {
              checked: false,
              text: 'Install dependencies',
            },
            {
              checked: false,
              text: 'Run build scripts',
            },
            {
              checked: false,
              text: 'Generate build artifacts',
            },
            {
              checked: false,
              text: 'Perform code quality checks',
            },
            // Add more build steps as needed
          ],
        },
      ],
    };
  },
  created() {
    this.initEditableChecklist();
    this.selectedTemplate = this.templates[0];
  },
  methods: {
    handleChange(template) {
      console.log('template', template);

      this.editableChecklist = [...this.editableChecklist, ...template.items];
      this.selectedTemplate = this.templates[0];
    },
    initEditableChecklist() {
      this.editableChecklist = this.checklist;
    },
    updateProgress() {
      const checkedItems = this.editableChecklist.filter(
        (item) => item.checked
      );
      this.progress = Math.floor(
        (checkedItems.length / this.editableChecklist.length) * 100
      );
    },

    saveItem(index) {
      if (this.editableChecklist[index].text.trim() === '') {
        this.editableChecklist.splice(index, 1);
      }
      this.saveData();
    },
    saveItemAndAddNew(index) {
      this.saveItem(index);
      this.editableChecklist.splice(index + 1, 0, { text: '', checked: false });
      this.$nextTick(() => {
        const input = this.$el.querySelectorAll('.checklist__item-input')[
          index + 1
        ];
        if (input) {
          this.$nextTick(() => {
            input.focus();
            input.select();
          });
        }
      });
    },

    saveData() {
      console.log('Saving data:', this.editableChecklist);
    },
    startTimeout() {
      this.timeoutId = setTimeout(() => {
        this.saveData();
      }, 3000);
    },
    getRef(index) {
      return `editInput-${index}`;
    },
    drag(event, index) {
      this.draggingIndex = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', event.target.innerHTML);
    },

    dragEnter(event, index) {
      event.preventDefault();
      this.dragOverIndex = index;
    },

    dragOver(event, index) {
      event.preventDefault();
      this.dragOverIndex = index;
    },

    dragLeave() {
      if (this.draggingIndex !== null) {
        this.dragOverIndex = this.draggingIndex;
      } else {
        this.dragOverIndex = null;
      }
    },

    allowDrop(event) {
      event.preventDefault();
    },
    drop(event) {
      event.preventDefault();
      if (this.draggingIndex !== null && this.dragOverIndex !== null) {
        const draggedItem = this.editableChecklist[this.draggingIndex];
        this.editableChecklist.splice(this.draggingIndex, 1);
        this.editableChecklist.splice(this.dragOverIndex, 0, draggedItem);
        this.draggingIndex = null;
        this.dragOverIndex = null;
        this.saveData();
      }
    },
  },
  watch: {
    editableChecklist: {
      handler() {
        clearTimeout(this.timeoutId);
        this.startTimeout();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.checklist {
  font-family: Arial, sans-serif;
  &__header {
    display: flex;
  }
  &__template-select {
    width: 200px;
    margin: 0 15px;
  }
  &__item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    border-bottom: 1px solid #ccc;

    &.is-dragging {
      opacity: 0.5;
    }

    &.is-drag-over {
      border-bottom: 2px solid blue;
    }
  }

  &__item .checklist-checkbox {
    margin-right: 12px;
    flex-shrink: 0;
  }

  &__item-input {
    border: none;
    font-size: 14px;
    line-height: 1.5;
    padding: 4px;
    margin: 0;
    outline: none;
    background-color: transparent;
    flex-grow: 1;

    &:focus {
      background-color: #f5f5f5;
    }
  }

  &__item-input a-checkbox {
    width: 100%;
  }

  &__icon {
    margin-right: 8px;
  }
}

a-checkbox span.ant-checkbox-inner {
  border-radius: 2px;
}

a-checkbox.ant-checkbox-checked span.ant-checkbox-inner {
  background-color: #0052cc;
  border-color: #0052cc;
}
</style>
