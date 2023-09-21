import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class CertificationCentersMembershipItemComponent extends Component {
  @tracked isEditionMode = false;

  @action
  editMembershipRole() {
    this.isEditionMode = true;
  }

  @action
  saveMembershipRole() {
    this.isEditionMode = false;
    this.args.onCertificationCenterMembershipRoleChange(this.args.certificationCenterMembership);
  }

  @action
  cancelMembershipRoleEditing() {
    console.group('cancelMembershipRoleEditing()');
    console.log({
      changedAttributes: this.args.certificationCenterMembership.changedAttributes(),
      hasDirtyAttributes: this.args.certificationCenterMembership.hasDirtyAttributes,
    });
    if (this.args.certificationCenterMembership.hasDirtyAttributes) {
      this.args.certificationCenterMembership.rollbackAttributes();
    }

    this.isEditionMode = false;
    console.groupEnd('cancelMembershipRoleEditing()');
  }

  @action
  onRoleSelected(role) {
    console.group('onRoleSelected()');
    console.log({
      changedAttributes: this.args.certificationCenterMembership.changedAttributes(),
      hasDirtyAttributes: this.args.certificationCenterMembership.hasDirtyAttributes,
    });
    this.args.certificationCenterMembership.role = role;
    console.groupEnd('onRoleSelected()');
  }
}
