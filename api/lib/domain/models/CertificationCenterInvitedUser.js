import { NotFoundError, AlreadyAcceptedOrCancelledInvitationError } from '../errors.js';
import { CertificationCenterInvitation } from './CertificationCenterInvitation.js';

class CertificationCenterInvitedUser {
  constructor({ userId, invitation, status } = {}) {
    this.userId = userId;
    this.invitation = invitation;
    this.status = status;
  }

  acceptInvitation(code) {
    if (code !== this.invitation.code) {
      throw new NotFoundError(
        `Not found certification center invitation for ID ${this.invitation.id} and code ${code}`,
      );
    }

    if (this.status !== 'pending') {
      throw new AlreadyAcceptedOrCancelledInvitationError();
    }

    this.status = CertificationCenterInvitation.StatusType.ACCEPTED;
  }
}

export { CertificationCenterInvitedUser };
