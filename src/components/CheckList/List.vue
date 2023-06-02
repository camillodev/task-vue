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
      <a-icon type="menu" />
      <a-checkbox
        v-model="item.checked"
        @click="emitSave()"
        :data-testid="`checkbox-${index}`"></a-checkbox>
      <input
        type="text"
        class="checklist-item-input"
        v-model="item.text"
        :ref="`input-${index}`"
        @input="emitSave()"
        @blur="$emit('save', internalItems)"
        @keyup.enter="saveItemAndAddNew(index)" />
    </div>
  </div>
</template>

<script lang="ts">
import { CheckListItem } from './interfaces';

export default {
  name: 'ListComponent',
  props: {
    items: {
      type: Array as () => CheckListItem[],
      required: true,
    },
  },
  data() {
    return {
      internalItems: [
        {
          text: '',
          checked: false,
        },
      ],
      debounceTimeout: null,
      draggingIndex: null,
      dragOverIndex: null,
    };
  },
  created() {
    if (this.items.length > 0) {
      this.internalItems = this.items;
    }
  },

  methods: {
    saveItem(index) {
      if (this.internalItems[index].text.trim() === '') {
        this.internalItems.splice(index, 1);
      }
      this.emitSave();
    },
    saveItemAndAddNew(index) {
      const currentItem = this.internalItems[index];
      const cursorPosition = this.$el.querySelectorAll('.checklist-item-input')[
        index
      ].selectionStart;
      const remainingText = currentItem.text.substring(cursorPosition);
      currentItem.text = currentItem.text.substring(0, cursorPosition).trim();

      this.internalItems.splice(index + 1, 0, {
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

      this.emitSave();
    },

    emitSave() {
      clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$emit('save', this.internalItems);
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
        const draggedItem = this.internalItems[this.draggingIndex];
        this.internalItems.splice(this.draggingIndex, 1);
        this.internalItems.splice(this.dragOverIndex, 0, draggedItem);
        this.draggingIndex = null;
        this.dragOverIndex = null;
        this.emitSave();
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
