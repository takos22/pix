'use strict';
module.exports = function getOrganizationMemberIdentities({ organizationId, organizationMemberIdentityRepository }) {
  return organizationMemberIdentityRepository.findAllByOrganizationId({ organizationId });
};
