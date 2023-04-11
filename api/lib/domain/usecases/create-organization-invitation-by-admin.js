import * as organizationInvitationService from '../services/organization-invitation-service.js';
import { OrganizationArchivedError } from '../errors.js';

const createOrganizationInvitationByAdmin = async function ({
  organizationId,
  email,
  locale,
  role,
  organizationRepository,
  organizationInvitationRepository,
}) {
  const organization = await organizationRepository.get(organizationId);

  if (organization.archivedAt) {
    throw new OrganizationArchivedError();
  }

  return organizationInvitationService.createOrUpdateOrganizationInvitation({
    organizationId,
    email,
    locale,
    role,
    organizationInvitationRepository,
    organizationRepository,
  });
};

export { createOrganizationInvitationByAdmin };
