<template>
  <div class="checklist">
    <div class="checklist-header">
      <a-progress :percent="progressPercentage" />
      <a-dropdown>
        <a-menu slot="overlay">
          <a-menu-item
            v-for="item in templates"
            :key="item.key"
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
    <List :items="externalChecklistItems" @save="saveList" />
  </div>
</template>

<script>
import List from './List.vue';
export default {
  name: 'CheckList',
  components: {
    List,
  },
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
      progress: 0,

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
    this.templates = this.templateData;
  },
  computed: {
    progressPercentage() {
      const checkedItems = this.externalChecklistItems.filter(
        (item) => item.checked
      );
      return Math.floor(
        (checkedItems.length / this.externalChecklistItems.length) * 100
      );
    },
  },
  methods: {
    selectTemplate(template) {
      // const { items } = template;
      // this.internalChecklistItems.push(...items);
      console.log(template);
      this.selectedTemplate = this.templates[0];
      // this.emitChangesWithDelay();
    },

    saveList(items) {
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
