import * as membershipRepository from '../../infrastructure/repositories/membership-repository.js';

const execute = function (userId, organizationId) {
  return membershipRepository
    .findByUserIdAndOrganizationId({ userId, organizationId })
    .then((memberships) =>
      memberships.reduce((isAdminInOrganization, membership) => isAdminInOrganization || membership.isAdmin, false)
    );
};

export { execute };
