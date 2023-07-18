import ApplicationAdapter from './application';

export default class Challenge extends ApplicationAdapter {
  urlForQueryRecord(query) {
    const url = `${this.host}/${this.namespace}/assessments/${query.assessmentId}/next`;
    delete query.assessmentId;
    return url;
  }

  urlForFindRecord(id, modelName, snapshot) {
    if (snapshot.adapterOptions?.draft) {
      return `${this.host}/${this.namespace}/challenge-previews/${id}`;
    }

    return super.urlForFindRecord(id, modelName, snapshot);
  }
}
