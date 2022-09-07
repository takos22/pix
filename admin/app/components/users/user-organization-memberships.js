import Component from '@glimmer/component';

export default class UserOrganizationMemberships extends Component {
  get activeOrganizationMemberships() {
    return this.args.organizationMemberships.filter((membership) => !membership.disabledAt);
  }
}
