import { defineStore } from 'pinia';
import { Template } from '../../interfaces';
import { FakeHttpApi } from '../../httpApi';
const httpApi = new FakeHttpApi();
export const useTemplateStore = defineStore('templateStore', {
  state: () => ({
    templates: [] as Template[],
  }),
  actions: {
    async fetchTemplates() {
      try {
        httpApi.getTemplates().then(({ data }) => {
          console.log('----- getTemplates -----', data);
          this.templates = data;
          this.saveTemplatesToStorage();
        });
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      }
    },
    addTemplate(template) {
      try {
        // Mock the successful response for adding a template
        const addedTemplate = { ...template };
        this.templates.push(addedTemplate);
        this.saveTemplatesToStorage();
      } catch (error) {
        console.error('Failed to add template:', error);
      }
    },
    updateTemplate(updatedTemplate) {
      try {
        // Mock the successful response for updating a template
        const index = this.templates.findIndex(
          (template) => template.id === updatedTemplate.id
        );
        if (index !== -1) {
          this.templates.splice(index, 1, updatedTemplate);
          this.saveTemplatesToStorage();
        }
      } catch (error) {
        console.error('Failed to update template:', error);
      }
    },
    deleteTemplate(templateId) {
      try {
        // Mock the successful response for deleting a template
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
