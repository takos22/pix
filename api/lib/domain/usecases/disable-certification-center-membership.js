'use strict';
module.exports = async function disableCertificationCenterMembership({
  certificationCenterMembershipId,
  certificationCenterMembershipRepository,
}) {
  return certificationCenterMembershipRepository.disableById({ certificationCenterMembershipId });
};
