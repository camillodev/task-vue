<template>
  <div class="description-field">
    <div class="description">
      <div class="description-text">
        <h1>{{ description }}</h1>
      </div>
    </div>

    <div class="checklist-wrapper">
      <CheckList :checklist="checklist" />
    </div>
  </div>
</template>

<script>
import CheckList from './CheckList.vue';

export default {
  name: 'DescriptionField',
  components: {
    CheckList,
  },
  data() {
    return {
      description: 'This is the description',
      checklist: [
        { text: 'Item 1', checked: false },
        { text: 'Item 2', checked: false },
        { text: 'Item 3', checked: false },
      ],
    };
  },
};
</script>

<style>
.description-field {
  background-color: #f6f8fa;
  border: 1px solid #dfe1e6;
  border-radius: 4px;
  padding: 12px;
  font-family: Arial, sans-serif;
  min-height: 500px;
}

.description {
  position: relative;
  cursor: text;
}

.description-text {
  padding: 6px;
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
  font-size: 16px;
  color: #172b4d;
  line-height: 1.5;
}

.description-input {
  resize: vertical;
  border: none;
  outline: none;
  width: 100%;
  min-height: 80px;
  font-size: 16px;
  color: #172b4d;
  background-color: #fff;
}

.checklist-wrapper {
  margin-top: 16px;
}
</style>
