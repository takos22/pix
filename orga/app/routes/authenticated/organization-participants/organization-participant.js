import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default class OrganizationParticipantRoute extends Route {
  @service store;
  @service router;
  @service currentUser;

  model(params) {
    return this.store
      .findRecord('organization-learner', params.participant_id)
      .then((organizationLearner) => {
        return RSVP.hash({
          organizationLearner,
          organization: this.currentUser.organization,
        });
      })
      .catch(() => this.router.replaceWith('authenticated.organization-participants'));
  }
}
