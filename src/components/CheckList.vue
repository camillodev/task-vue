<template>
  <div class="checklist">
    <div
      v-for="(item, index) in editableChecklist"
      :key="index"
      class="checklist__item"
      @click="editItem(index)">
      <a-checkbox
        v-model="editableChecklist[index].checked"
        @change="updateProgress"
        class="checklist-checkbox">
      </a-checkbox>

      <input
        type="text"
        class="checklist__item-input"
        v-model="editableChecklist[index].text"
        :ref="getRef(index)"
        @blur="saveItem(index)"
        @keyup.enter="saveItemAndAddNew(index)" />
    </div>
    <Progress :percent="progress" />
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
    };
  },
  mounted() {
    this.initEditableChecklist();
  },
  methods: {
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
    editItem(index) {
      clearTimeout(this.timeoutId);
      this.$nextTick(() => {
        const input = this.$refs[this.getRef(index)];
        if (input) {
          input.focus();
          input.select();
        }
      });
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
      // Simulate saving the data to a service
      // Replace this with your own implementation
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
  &__item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    border-bottom: 1px solid #ccc;
  }
  &__item .checklist-checkbox {
    margin-right: 12px;
    flex-shrink: 0;
  }

  &__item-text {
    margin-left: 8px;
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
}

a-checkbox span.ant-checkbox-inner {
  border-radius: 2px;
}

a-checkbox.ant-checkbox-checked span.ant-checkbox-inner {
  background-color: #0052cc;
  border-color: #0052cc;
}

a-checkbox.ant-checkbox-disabled {
  cursor: not-allowed;
}

a-checkbox.ant-checkbox-disabled span.ant-checkbox-inner {
  background-color: #eaeaea;
  border-color: #eaeaea;
}

a-checkbox.ant-checkbox-disabled + span {
  color: #bbb;
  cursor: not-allowed;
}
</style>
