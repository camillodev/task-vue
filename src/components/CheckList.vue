<template>
  <div class="checklist">
    <div class="checklist-header">
      <a-progress :percent="progressPercentage" />
      <a-select label-in-value :default-value="selectedTemplate">
        <a-select-option
          v-for="item in templates"
          :key="item.key"
          :value="item.key"
          @click="selectTemplate(item)">
          {{ item.value }}
        </a-select-option>
      </a-select>
      <a-button type="primary">Save as Template</a-button>
    </div>
    <div
      v-for="(item, index) in internalChecklistItems"
      :key="index"
      class="checklist-item"
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
      <a-icon type="menu" />
      <a-checkbox v-model="item.checked"></a-checkbox>
      <input
        type="text"
        class="checklist-item-input"
        v-model="item.text"
        :ref="`input-${index}`"
        @blur="saveItem(index)"
        @keyup.enter="saveItemAndAddNew(index)" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CheckList',
  props: {
    externalChecklistItems: {
      type: Array,
      required: true,
    },
    templateData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      internalChecklistItems: [
        {
          text: '',
          checked: false,
        },
      ],
      debounceTimeout: null,
      progress: 0,
      draggingIndex: null,
      dragOverIndex: null,
      selectedTemplate: {
        key: 0,
        value: 'Select Template',
      },
      templates: [
        {
          key: 0,
          value: 'Select Template',
        },
      ],
    };
  },
  created() {
    this.editableChecklist = this.checklist;
    this.internalChecklistItems = this.externalChecklistItems;
    this.templates.push(...this.templateData);
  },
  computed: {
    progressPercentage() {
      const checkedItems = this.internalChecklistItems.filter(
        (item) => item.checked
      );
      return Math.floor(
        (checkedItems.length / this.internalChecklistItems.length) * 100
      );
    },
  },
  methods: {
    selectTemplate(template) {
      const { items } = template;
      this.internalChecklistItems.push(...items);
      this.selectedTemplate = this.templates[0];
      this.emitChangesWithDelay();
    },

    saveItem(index) {
      if (this.internalChecklistItems[index].text.trim() === '') {
        this.internalChecklistItems.splice(index, 1);
      }
      this.emitChangesWithDelay();
    },
    saveItemAndAddNew(index) {
      const currentItem = this.internalChecklistItems[index];
      const cursorPosition = this.$el.querySelectorAll('.checklist-item-input')[
        index
      ].selectionStart;
      const remainingText = currentItem.text.substring(cursorPosition);
      currentItem.text = currentItem.text.substring(0, cursorPosition).trim();

      this.internalChecklistItems.splice(index + 1, 0, {
        text: remainingText,
        checked: false,
      });

      this.$nextTick(() => {
        const newInput = this.$el.querySelectorAll('.checklist-item-input')[
          index + 1
        ];
        newInput?.focus();
        newInput?.setSelectionRange(0, 0);
      });

      this.emitChangesWithDelay();
    },

    emitChangesWithDelay() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$emit('change', this.internalChecklistItems);
      }, 3000);
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
        const draggedItem = this.internalChecklistItems[this.draggingIndex];
        this.internalChecklistItems.splice(this.draggingIndex, 1);
        this.internalChecklistItems.splice(this.dragOverIndex, 0, draggedItem);
        this.draggingIndex = null;
        this.dragOverIndex = null;
        this.emitChangesWithDelay();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checklist {
  font-family: Arial, sans-serif;

  &-header {
    display: flex;
  }

  &-item {
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

  &-item-input {
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
}

.anticon {
  margin-right: 8px;
}
a-checkbox span.ant-checkbox-inner {
  border-radius: 2px;
}

a-checkbox.ant-checkbox-checked span.ant-checkbox-inner {
  background-color: #0052cc;
  border-color: #0052cc;
}
</style>
