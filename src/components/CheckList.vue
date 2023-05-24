current component:

<template>
  <div class="checklist">
    <div
      v-for="(item, index) in editableChecklist"
      :key="index"
      class="checklist-item"
      @click="editItem(index)">
      <a-checkbox
        v-model="editableChecklist[index].checked"
        @change="updateProgress"
        :disabled="item.editing"
        class="checklist-checkbox">
        <span v-if="!item.editing">{{ item.text }}</span>
      </a-checkbox>
      <input
        type="text"
        class="edit-input"
        v-if="item.editing"
        v-model="editableChecklist[index].text"
        :ref="getRef(index)"
        @blur="saveItem(index)"
        @keyup.enter="saveItemAndAddNew(index)" />
    </div>
  </div>
</template>

<script>
export default {
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
    };
  },
  mounted() {
    this.initEditableChecklist();
  },
  methods: {
    initEditableChecklist() {
      this.editableChecklist = JSON.parse(JSON.stringify(this.checklist));
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
      this.editableChecklist[index].editing = true;
      this.$nextTick(() => {
        const input = this.$refs[this.getRef(index)];
        if (input) {
          input.focus();
        }
      });
    },

    saveItem(index) {
      if (this.editableChecklist[index].text.trim() === '') {
        this.editableChecklist.splice(index, 1);
      } else {
        this.editableChecklist[index].editing = false;
      }
      this.saveData();
    },
    saveItemAndAddNew(index) {
      this.saveItem(index);
      this.editableChecklist.push({ text: '', checked: false, editing: true });
      this.$nextTick(() => {
        const lastIndex = this.editableChecklist.length - 1;
        const input = this.$refs[this.getRef(lastIndex)];
        if (input) {
          input.focus();
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

<style>
.checklist {
  font-family: Arial, sans-serif;
}

.checklist-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-bottom: 1px solid #ccc;
}

.checklist-checkbox {
  margin-right: 12px;
  flex-shrink: 0;
}

.checklist-text {
  margin-left: 8px;
  flex-grow: 1;
}

.edit-input {
  border: none;
  font-size: 14px;
  line-height: 1.5;
  padding: 4px;
  margin: 0;
  outline: none;
  background-color: transparent;
  flex-grow: 1;
}

.edit-input:focus {
  background-color: #f5f5f5;
}

a-checkbox {
  width: 100%;
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
