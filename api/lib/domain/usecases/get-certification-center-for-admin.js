'use strict';
module.exports = function getCertificationCenterForAdmin({ id, certificationCenterForAdminRepository }) {
  return certificationCenterForAdminRepository.get(id);
};
