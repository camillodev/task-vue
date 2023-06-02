import { defineStore } from 'pinia';
import { CheckList, CheckListItem, Template } from './interfaces';
import { FakeHttpApi } from '../../httpApi';
const httpApi = new FakeHttpApi();

export const useTemplateStore = defineStore('templateStore', {
  state: () => ({
    templates: [] as Template[],
  }),
  actions: {
    async fetchTemplates() {
      try {
        const { data } = await httpApi.getTemplates();
        this.templates = data;
        this.saveTemplatesToStorage();
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    },
    async addTemplate(template) {
      try {
        const { data } = await httpApi.createTemplate({ template });
        this.templates.push(data);
        this.saveTemplatesToStorage();
      } catch (error) {
        console.error('Failed to add template:', error);
      }
    },
    async updateTemplate(updatedTemplate) {
      try {
        const { data } = await httpApi.updateTemplate({
          id: updatedTemplate.id,
          template: updatedTemplate,
        });
        const index = this.templates.findIndex(
          (template) => template.id === updatedTemplate.id
        );
        if (index !== -1) {
          this.templates.splice(index, 1, data);
          this.saveTemplatesToStorage();
        }
      } catch (error) {
        console.error('Failed to update template:', error);
      }
    },
    async deleteTemplate(templateId) {
      try {
        await httpApi.deleteTemplate({ id: templateId });
        const index = this.templates.findIndex(
          (template) => template.id === templateId
        );
        if (index !== -1) {
          this.templates.splice(index, 1);
          this.saveTemplatesToStorage();
        }
      } catch (error) {
        console.error('Failed to delete template:', error);
      }
    },
    saveTemplatesToStorage() {
      try {
        // Save the templates to local storage
        localStorage.setItem('templateStore', JSON.stringify(this.templates));
      } catch (error) {
        console.error('Failed to save templates to local storage:', error);
      }
    },
  },
});

export const useCheckListStore = defineStore('checklistStore', {
  state: () => ({
    checklist: {
      id: '',
      updatedAt: Date.now().toString(),
      items: [],
    } as CheckList,
  }),
  actions: {
    async getCheckList(id: string) {
      try {
        const { data } = await httpApi.getCheckList({ id });
        this.checklist = data;
      } catch (error) {
        console.error('An error occurred while fetching the checklist:', error);
      }
    },
    async updateCheckList(checklist: CheckList) {
      try {
        const { data } = await httpApi.updateCheckList({
          id: checklist.id,
          checklist,
        });
        this.checklist = data;
      } catch (error) {
        console.error('An error occurred while updating the checklist:', error);
      }
    },
    async deleteCheckList(id: string) {
      try {
        await httpApi.deleteCheckList({ id });
        this.createCheckList();
      } catch (error) {
        console.error('An error occurred while deleting the checklist:', error);
      }
    },
    async createCheckList() {
      try {
        const checklist: CheckList = {
          id: '',
          updatedAt: Date.now().toString(),
          items: [],
        };
        const { data } = await httpApi.createCheckList({ checklist });
        this.checklist = data;
      } catch (error) {
        console.error('An error occurred while creating the checklist:', error);
      }
    },
  },
});
