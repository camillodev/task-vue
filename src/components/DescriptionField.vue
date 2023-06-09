<template>
  <div class="description-field">
    <div class="checklist-wrapper">
      <CheckListComponent :id="checklistId || undefined" />
    </div>
  </div>
</template>

<script lang="ts">
import CheckListComponent from '@/components/CheckList/CheckList.vue';

export default {
  name: 'DescriptionField',
  components: {
    CheckListComponent,
  },
  data() {
    return {
      checklistId: null,
    };
  },
  created() {
    this.loadChecklistId();
  },
  methods: {
    loadChecklistId() {
      const checklists = JSON.parse(localStorage.getItem('checklists') || '[]');
      this.checklistId = checklists.length > 0 ? checklists[0].id : '';
    },
  },
};
</script>

<style>
.description-field {
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
