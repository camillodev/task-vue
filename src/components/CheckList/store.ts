import { defineStore } from 'pinia';
import { CheckList, CheckListItem } from './interfaces';
import { FakeHttpApi } from '../../httpApi';
const httpApi = new FakeHttpApi();

export const useCheckListStore = defineStore('checklistStore', {
  state: () => ({
    checklist: {} as CheckList,
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
          items: [
            { text: '', checked: false, updatedAt: Date.now().toString() },
          ],
        };
        const { data } = await httpApi.createCheckList({ checklist });
        this.checklist = data;
      } catch (error) {
        console.error('An error occurred while creating the checklist:', error);
      }
    },
  },
});
