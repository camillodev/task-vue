<template>
  <div class="checklist">
    <div class="checklist-header">
      <a-progress :percent="progressPercentage" />
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="template in templates"
            :key="template.id"
            @click="selectTemplate(template)">
            {{ template.value }}
          </a-menu-item>
        </a-menu>
        <a-button> Load Template <a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item> Save as Template </a-menu-item>
          <a-menu-item> Manage Templates </a-menu-item>
          <a-menu-item @click="deleteCheckList"> Delete Checklist </a-menu-item>
        </a-menu>
        <a-button>
          <a-icon type="ellipsis" />
        </a-button>
      </a-dropdown>
    </div>
    <List :items="checklistItems" @save="saveList" />
  </div>
</template>

<script lang="ts">
import { CheckList, CheckListItem, Template } from './interfaces';
import List from './List.vue';
import { mapActions, mapState } from 'pinia';
import { useTemplateStore, useCheckListStore } from './store';

export default {
  name: 'CheckListComponent',
  components: {
    List,
  },
  props: {
    checklistId: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      progress: 0,
    };
  },
  created() {
    this.fetchTemplates();
    if (this.checklistId) {
      this.getCheckList(this.checklistId);
    } else {
      const newChecklist: CheckList = {
        id: '',
        updatedAt: Date.now().toString(),
        items: [],
      };
      this.createCheckList(newChecklist);
    }
  },
  computed: {
    ...mapState(useTemplateStore, ['templates']),
    ...mapState(useCheckListStore, ['checklist']),
    checklistItems() {
      return this.checklist
        ? this.checklist.items.map((item) => ({ ...item }))
        : [];
    },
    progressPercentage() {
      const checkedItems = this.checklistItems.filter((item) => item.checked);
      return Math.floor(
        (checkedItems.length / this.checklistItems.length) * 100
      );
    },
  },
  methods: {
    ...mapActions(useTemplateStore, ['fetchTemplates']),
    ...mapActions(useCheckListStore, [
      'getCheckList',
      'createCheckList',
      'updateCheckList',
      'deleteCheckList',
    ]),
    selectTemplate(template: Template) {
      this.checklist.items.push(...template.items);
      this.saveList(this.checklist.items);
    },
    deleteCheckList() {
      this.deleteCheckList(this.checklistId);
      this.$destroy();
    },
    saveList(items: CheckListItem[]) {
      this.updateCheckList({ ...this.checklist, items });
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
}

.anticon {
  margin-right: 8px;
}

.ant-btn {
  margin-left: 10px;
  .anticon {
    margin-right: 0;
  }
}
</style>
