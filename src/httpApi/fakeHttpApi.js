import {
  _200_OK,
  _404_NOT_FOUND,
  is4xxClientError,
  is5xxServerError,
} from './httpStatus';
import { v4 as uuidv4 } from 'uuid';

import mockTemplates from './templates.json';

class FakeHttpApi {
  constructor() {
    const storedChecklists = localStorage.getItem('checklists');
    const storedTemplates = localStorage.getItem('templates');

    this._checklists = storedChecklists ? JSON.parse(storedChecklists) : [];
    this._templates = storedTemplates
      ? JSON.parse(storedTemplates)
      : mockTemplates;

    this.getCheckList = this.getCheckList.bind(this);
    this.createCheckList = this.createCheckList.bind(this);
    this.updateCheckList = this.updateCheckList.bind(this);
    this.deleteCheckList = this.deleteCheckList.bind(this);

    this.getTemplates = this.getTemplates.bind(this);
    this.getTemplate = this.getTemplate.bind(this);
    this.createTemplate = this.createTemplate.bind(this);
    this.updateTemplate = this.updateTemplate.bind(this);
    this.deleteTemplate = this.deleteTemplate.bind(this);

    this.fakeResponse = this.fakeResponse.bind(this);
  }
  fakeResponse({ status, data, maxLatencyInMillis }) {
    const latency = Math.round(Math.random() * maxLatencyInMillis);

    return new Promise((resolve, reject) =>
      setTimeout(
        () =>
          is4xxClientError(status) || is5xxServerError(status)
            ? reject({ status, data })
            : resolve({ status, data }),
        latency
      )
    );
  }

  getCheckList({ id }) {
    const storedChecklists = JSON.parse(
      localStorage.getItem('checklists') || '[]'
    );
    const checklist = storedChecklists.find((checklist) => checklist.id === id);

    if (!checklist) {
      return this.fakeResponse({
        status: _404_NOT_FOUND,
      });
    }

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: checklist,
    });
  }

  createCheckList({ checklist }) {
    const newChecklist = {
      ...checklist,
      id: uuidv4(),
      updatedAt: new Date().toISOString(),
    };

    this._checklists.push(newChecklist);

    localStorage.setItem('checklists', JSON.stringify(this._checklists));

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: newChecklist,
    });
  }

  updateCheckList({ id, checklist }) {
    const index = this._checklists.findIndex(
      (checklist) => checklist.id === id
    );

    if (index === -1)
      return this.fakeResponse({
        status: _404_NOT_FOUND,
      });

    this._checklists[index] = {
      ...this._checklists[index],
      ...checklist,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('checklists', JSON.stringify(this._checklists));

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: this._checklists[index],
    });
  }

  deleteCheckList({ id }) {
    const index = this._checklists.findIndex(
      (checklist) => checklist.id === id
    );

    if (index === -1)
      return this.fakeResponse({
        status: _404_NOT_FOUND,
      });

    this._checklists.splice(index, 1);

    localStorage.setItem('checklists', JSON.stringify(this._checklists));

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
    });
  }

  getTemplates() {
    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: this._templates,
    });
  }

  getTemplate({ id }) {
    const template = this._templates.find((template) => template.id === id);

    if (!template)
      return this.fakeResponse({
        status: _404_NOT_FOUND,
      });

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: template,
    });
  }

  createTemplate({ template }) {
    const newTemplate = {
      id: uuidv4(),
      updatedAt: new Date().toISOString(),
      ...template,
    };

    this._templates.push(newTemplate);

    localStorage.setItem('templates', JSON.stringify(this._templates));

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: newTemplate,
    });
  }

  updateTemplate({ id, template }) {
    const index = this._templates.findIndex((template) => template.id === id);

    if (index === -1)
      return this.fakeResponse({
        status: _404_NOT_FOUND,
      });

    this._templates[index] = {
      ...this._templates[index],
      ...template,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('templates', JSON.stringify(this._templates));

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: this._templates[index],
    });
  }

  deleteTemplate({ id }) {
    const index = this._templates.findIndex((template) => template.id === id);

    if (index === -1)
      return this.fakeResponse({
        status: _404_NOT_FOUND,
      });

    this._templates.splice(index, 1);

    localStorage.setItem('templates', JSON.stringify(this._templates));

    return this.fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
    });
  }
}

export default FakeHttpApi;
