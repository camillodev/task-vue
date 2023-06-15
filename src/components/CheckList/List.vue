<template>
  <div class="checklist">
    <div
      v-for="(item, index) in internalItems"
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
      <a-icon class="menu-icon" type="menu" />
      <a-checkbox
        class="checkbox"
        v-model="item.checked"
        @click="saveItem(index)"
        :data-testid="`checkbox-${index}`"
        :disabled="item.text.trim() === ''"></a-checkbox>
      <input
        type="text"
        class="checklist-item-input"
        v-model="item.text"
        :ref="`input-${index}`"
        @input="saveChecklist()"
        @blur="saveChecklist"
        @keyup.enter="saveItemAndAddNew(index)"
        @keydown.delete="cleanItem(index)" />
      <button @click="deleteItem(index)" class="delete-button">
        <a-icon type="delete" />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapState } from 'pinia';
import { useCheckListStore } from './store';
import debounce from 'lodash.debounce';

export default {
  name: 'ListComponent',
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  computed: {
    ...mapState(useCheckListStore, ['checklist']),

    internalItems() {
      if (
        !this.checklist ||
        !this.checklist.items ||
        this.checklist.items.length === 0
      ) {
        return [{ text: '', checked: false }];
      }
      return this.checklist.items;
    },
  },
  data() {
    return {
      draggingIndex: null,
      dragOverIndex: null,
    };
  },
  mounted() {
    if (this.id) {
      this.getCheckList(this.id);
    } else {
      this.createCheckList();
    }
  },
  methods: {
    ...mapActions(useCheckListStore, [
      'getCheckList',
      'createCheckList',
      'updateCheckList',
    ]),

    cleanItem(index) {
      const { internalItems } = this;
      if (internalItems[index].text.trim() === '') {
        this.deleteItem(index);
      }
    },
    deleteItem(index) {
      this.internalItems.splice(index, 1);
      this.saveChecklist();
    },
    saveItem(index) {
      const { internalItems } = this;
      if (
        internalItems &&
        internalItems[index] &&
        internalItems[index].text.trim() === ''
      ) {
        internalItems.splice(index, 1);
      }
      this.saveChecklist();
    },
    saveItemAndAddNew(index) {
      const { internalItems } = this;
      const currentItem = internalItems[index];
      const cursorPosition = this.$el.querySelectorAll('.checklist-item-input')[
        index
      ].selectionStart;
      const remainingText = currentItem.text.substring(cursorPosition);
      currentItem.text = currentItem.text.substring(0, cursorPosition).trim();

      internalItems.splice(index + 1, 0, {
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

      this.saveChecklist();
    },
    saveChecklist: debounce(function () {
      const checklist = {
        ...this.checklist,
        items: [...this.internalItems],
      };
      this.updateCheckList(checklist);
    }, 3000),
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
    drop(event) {
      event.preventDefault();
      if (this.draggingIndex !== null && this.dragOverIndex !== null) {
        const draggedItem = this.internalItems[this.draggingIndex];
        this.internalItems.splice(this.draggingIndex, 1);
        this.internalItems.splice(this.dragOverIndex, 0, draggedItem);
        this.draggingIndex = null;
        this.dragOverIndex = null;
        this.saveChecklist();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.checklist {
  font-family: Arial, sans-serif;

  &-item {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 8px;
    transition: background-color 0.3s;

    &:focus-within,
    &:hover {
      background-color: #188fff52;

      .delete-button,
      .menu-icon {
        visibility: visible;
        opacity: 1;
        transition-delay: 0s;
      }
    }

    .menu-icon {
      margin-right: 8px;
      font-size: 20px;
      color: #1890ff;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s linear 0.2s, opacity 0.2s linear;
    }

    .delete-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s linear 0.2s, opacity 0.2s linear;

      &:hover {
        color: #1890ff;
      }

      .anticon {
        font-size: 16px;
      }
    }

    &.is-dragging {
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:not(.is-drag-over):not(:last-child) {
      border: none;
    }

    &:first-child.is-drag-over {
      border-top: 1px solid #1890ff;
    }

    &:last-child.is-drag-over {
      border-bottom: 1px solid #1890ff;
    }

    &.is-drag-over {
      border: 1px solid #1890ff;
    }
  }

  .checkbox {
    margin-right: 8px;
    color: #1890ff;
  }

  .checklist-item-input {
    border: none;
    font-size: 14px;
    line-height: 1.5;
    padding: 4px;
    margin: 0;
    outline: none;
    background-color: transparent;
    flex-grow: 1;

    &:focus {
      background-color: none;
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
  background-color: #1890ff;
  border-color: #1890ff;
}
</style>
