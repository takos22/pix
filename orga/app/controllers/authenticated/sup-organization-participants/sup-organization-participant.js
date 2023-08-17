import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class SupOrganizationParticipant extends Controller {
  @service intl;

  get breadcrumbLinks() {
    return [
      {
        route: 'authenticated.sup-organization-participants',
        label: this.intl.t('navigation.main.sup-organization-participants'),
      },
      {
        route: 'authenticated.sup-organization-participants.sup-organization-participant',
        label: this.intl.t('common.fullname', {
          firstName: this.model.firstName,
          lastName: this.model.lastName,
        }),
      },
    ];
  }
}
