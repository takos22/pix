import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class UserSettingsRoute extends Route {
  @service currentUser;
  @service store;

  model() {
    const userId = this.currentUser.user.id;
    return this.store.findRecord('user-setting', userId);
  }
}
