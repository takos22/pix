import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class UserSettingsRoute extends Route {
  @service currentUser;
  @service store;

  async model() {
    const userSettings = this.store.find('user-setting', this.currentUser.user.id)
    return { userSettings }
  }
}
