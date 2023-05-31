import {
  _200_OK,
  _404_NOT_FOUND,
  _429_TOO_MANY_REQUESTS,
  is4xxClientError,
  is5xxServerError,
} from './httpStatus';

const mockTemplates = require('./templates.json');

const SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS = 300;

const fakeResponse = ({ status, data, maxLatencyInMillis }) => {
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
};

class IntervalCheck {
  passedLessThan = (minInterval) => {
    const now = new Date();
    const differenceInMilliseconds = Math.abs(now - this.previousNow);
    this.previousNow = now;
    return differenceInMilliseconds < minInterval;
  };
}

class FakeHttpApi {
  constructor() {
    this._templates = mockTemplates;
    this._intervalCheck = new IntervalCheck();
    this.getFirst5MatchingTemplates =
      this.getFirst5MatchingTemplates.bind(this);
    this.getTemplates = this.getTemplates.bind(this);
    this.getTemplateById = this.getTemplateById.bind(this);
  }

  getFirst5MatchingTemplates({ namePart }) {
    if (
      this._intervalCheck.passedLessThan(SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS)
    ) {
      return fakeResponse({
        status: _429_TOO_MANY_REQUESTS,
        maxLatencyInMillis: 100,
      });
    }

    const normalizedNamePart = (namePart || '')
      .toLowerCase()
      .trim()
      .replace(/\s\s+/g, ' ');

    const matchingTemplates = !!normalizedNamePart
      ? this._templates.filter((template) =>
          template.name.toLowerCase().includes(normalizedNamePart)
        )
      : [];

    return fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 250,
      data: matchingTemplates.slice(0, 5),
    });
  }

  getTemplates() {
    const template = this._templates;

    if (!template)
      return fakeResponse({
        status: _404_NOT_FOUND,
      });

    return fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: template,
    });
  }

  getTemplateById({ templateId: templateId }) {
    const template = this._templates.find(
      (template) => template.id === templateId
    );

    if (!template)
      return fakeResponse({
        status: _404_NOT_FOUND,
      });

    return fakeResponse({
      status: _200_OK,
      maxLatencyInMillis: 500,
      data: template,
    });
  }
}

export default FakeHttpApi;
export { SEARCH_REQUEST_MIN_INTERVAL_IN_MILLIS };
