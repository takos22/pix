import SecuredRouteMixin from '../mixins/secured-route-mixin';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';


export default class UserSettingsRoute extends Route.extend(SecuredRouteMixin) {
    @service currentUser;

    async model(){
        const userSettings = await this.store.findRecord('user-setting', this.currentUser.user.id);
        return {userSettings};
    }
}
