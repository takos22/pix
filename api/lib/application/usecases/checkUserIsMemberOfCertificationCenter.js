import * as certificationCenterMembershipRepository from '../../infrastructure/repositories/certification-center-membership-repository.js';

const execute = async function (userId, certificationCenterId) {
  return await certificationCenterMembershipRepository.isMemberOfCertificationCenter({
    userId,
    certificationCenterId,
  });
};

export { execute };
