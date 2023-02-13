import Controller from '@ember/controller';
import { action } from '@ember/object';
import Session from '../../../models/session';
// eslint-disable-next-line ember/no-computed-properties-in-native-classes
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class SessionsNewController extends Controller {
  @service store;
  @service router;
  @tracked session = {}; //new Session();
  // @alias('model') certificationCenterId;

  get pageTitle() {
    return "Planification d'une session | Pix Certif";
  }

  @action
  async createSession(event) {
    event.preventDefault();
    try {
      const superSession = {
        ...this.session,
        certificationCenterId: 5, //this.certificationCenterId,
      };
      console.log({ superSession });
      const newsession = this.store.createRecord('session', {
        id: 123,
        hasSomeCleaAcquired: true,
        publishedAt: '2022-01-01',
      });
      console.log({ newsession });
      await newsession.save();
    } catch (e) {
      console.error({ e });
      throw e;
    }
    console.log('saved, on transit');
    this.router.transitionTo('authenticated.sessions.details', this.session.id);
  }

  @action
  cancel() {
    this.router.transitionTo('authenticated.sessions.list');
  }

  @action
  onDatePicked(selectedDates, lastSelectedDateFormatted) {
    this.session.date = lastSelectedDateFormatted;
  }

  @action
  onTimePicked(selectedTimes, lastSelectedTimeFormatted) {
    this.session.time = lastSelectedTimeFormatted;
  }
}
