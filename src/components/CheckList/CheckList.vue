<template>
  <div class="checklist">
    <div class="checklist-header">
      <a-progress :percent="progressPercentage" />
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="item in templates"
            :key="item.id"
            @click="selectTemplate(item)">
            {{ item.value }}
          </a-menu-item>
        </a-menu>
        <a-button> Load Template <a-icon type="down" /> </a-button>
      </a-dropdown>
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item> Save as Template </a-menu-item>
          <a-menu-item> Manage Templates </a-menu-item>
        </a-menu>
        <a-button>
          <a-icon type="ellipsis" />
        </a-button>
      </a-dropdown>
    </div>
    <List :items="items" @save="saveList" />
  </div>
</template>

<script lang="ts">
import { CheckListItem, Template } from '../../interfaces';
import List from './List.vue';

export default {
  name: 'CheckList',
  components: {
    List,
  },
  props: {
    listItems: {
      type: Array as () => CheckListItem[],
      required: true,
    },
    templates: {
      type: Array as () => Template[],
      required: true,
    },
  },
  data() {
    return {
      progress: 0,
      items: [...this.listItems] as CheckListItem[],
    };
  },
  created() {},
  computed: {
    progressPercentage() {
      const checkedItems = this.items.filter((item) => item.checked);
      return Math.floor((checkedItems.length / this.items.length) * 100);
    },
  },
  methods: {
    selectTemplate(template: Template) {
      console.log(template);
      this.items.push(...template.items);
    },

    saveList(items: CheckListItem[]) {
      console.log('save to pinia', items);
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
