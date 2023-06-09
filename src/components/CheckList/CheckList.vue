<template>
  <div class="checklist">
    <div class="checklist-header">
      <a-progress :percent="progressPercentage" />
      <a-button @click="onDeleteCheckList" type="primary" ghost
        >Clean Checklist</a-button
      >
    </div>
    <List :id="id" />
  </div>
</template>

<script lang="ts">
import { CheckListItem } from './interfaces';
import List from './List.vue';
import { mapActions, mapState } from 'pinia';
import { useCheckListStore } from './store';
import router from '@/router';

export default {
  name: 'CheckListComponent',
  components: {
    List,
  },
  props: {
    id: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      progress: 0,
    };
  },

  computed: {
    ...mapState(useCheckListStore, ['checklist']),

    progressPercentage() {
      if (!this.checklist || !this.checklist.items) return 0;
      const checkedItems = this.checklist.items.filter((item) => item.checked);
      return Math.floor(
        (checkedItems.length / this.checklist.items.length) * 100
      );
    },
  },
  methods: {
    ...mapActions(useCheckListStore, ['deleteCheckList']),

    onDeleteCheckList() {
      this.deleteCheckList(this.id);
    },
  },
};
</script>
