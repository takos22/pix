import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ChallengeDraftPreviewRoute extends Route {
  @service router;
  @service store;

  model(params) {
    this.challengeDraftId = params.challenge_draft_id;
  }

  afterModel() {
    const assessment = this.store.createRecord('assessment', { type: 'PREVIEW' });

    return assessment.save().then(() => {
      return this.router.replaceWith('assessments.challenge', assessment.id, assessment.currentChallengeNumber, {
        queryParams: { challengeDraftId: this.challengeDraftId },
      });
    });
  }
}
