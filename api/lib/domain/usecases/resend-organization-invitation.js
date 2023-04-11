import * as organizationInvitationService from '../../domain/services/organization-invitation-service.js';

const resendOrganizationInvitation = async function ({
  organizationId,
  email,
  locale,
  organizationRepository,
  organizationInvitationRepository,
}) {
  return organizationInvitationService.createOrUpdateOrganizationInvitation({
    organizationRepository,
    organizationInvitationRepository,
    organizationId,
    email,
    locale,
  });
};

export { resendOrganizationInvitation };
