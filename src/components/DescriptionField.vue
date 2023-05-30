<template>
  <div class="description-field">
    <div class="checklist-wrapper">
      <CheckListComponent
        :list-items="checklist.items"
        :templates="templates"
        @change="handleChecklistChange" />
    </div>
  </div>
</template>

<script lang="ts">
import { CheckList, CheckListItem, Template } from '../interfaces';
import DescriptionService from '../services/DescriptionService';
import CheckListComponent from '@/components/CheckList/CheckList.vue';

export default {
  name: 'DescriptionField',
  components: {
    CheckListComponent,
  },
  data() {
    return {
      checklist: {
        id: 'checklist-id',
        updatedAt: '2023-05-15T09:00:00Z',
        items: [
          {
            id: '1',
            text: 'Item 1',
            checked: false,
            updatedAt: '2023-05-15T09:01:00Z',
          },
          {
            id: '2',
            text: 'Item 2',
            checked: false,
            updatedAt: '2023-05-16T10:12:00Z',
          },
          {
            id: '3',
            text: 'Item 3',
            checked: false,
            updatedAt: '2023-05-17T11:25:00Z',
          },
        ] as CheckListItem[],
      } as CheckList,
      templates: [
        {
          id: '1',
          updatedAt: '2023-05-18T13:30:00Z',
          value: 'Definition of Done',
          items: [
            {
              id: '4',
              checked: false,
              text: 'All acceptance criteria are met',
              updatedAt: '2023-05-19T15:40:00Z',
            },
            {
              id: '5',
              checked: false,
              text: 'Code is reviewed and approved',
              updatedAt: '2023-05-20T16:55:00Z',
            },
            {
              id: '6',
              checked: false,
              text: 'Unit tests are passing',
              updatedAt: '2023-05-21T18:10:00Z',
            },
          ],
        },
        {
          id: '2',
          updatedAt: '2023-05-22T20:20:00Z',
          value: 'Build Steps',
          items: [
            {
              id: '7',
              checked: false,
              text: 'Pull latest code from the repository',
              updatedAt: '2023-05-23T22:35:00Z',
            },
            {
              id: '8',
              checked: false,
              text: 'Install dependencies',
              updatedAt: '2023-05-24T23:50:00Z',
            },
            {
              id: '9',
              checked: false,
              text: 'Run build scripts',
              updatedAt: '2023-05-25T01:05:00Z',
            },
            {
              id: '10',
              checked: false,
              text: 'Generate build artifacts',
              updatedAt: '2023-05-26T02:20:00Z',
            },
            {
              id: '11',
              checked: false,
              text: 'Perform code quality checks',
              updatedAt: '2023-05-27T03:35:00Z',
            },
          ],
        },
      ] as Template[],
    };
  },
  methods: {
    handleChecklistChange(updatedChecklist: CheckListItem[]) {
      this.description.checklist = updatedChecklist;
      DescriptionService.saveDescription(this.description);
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
