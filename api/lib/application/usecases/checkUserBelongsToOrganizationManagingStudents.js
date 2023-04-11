import * as membershipRepository from '../../infrastructure/repositories/membership-repository.js';

const execute = async function (userId, organizationId) {
  const memberships = await membershipRepository.findByUserIdAndOrganizationId({
    userId,
    organizationId,
    includeOrganization: true,
  });
  return memberships.reduce(
    (belongsToScoOrganization, membership) => belongsToScoOrganization || membership.organization.isManagingStudents,
    false
  );
};

export { execute };
