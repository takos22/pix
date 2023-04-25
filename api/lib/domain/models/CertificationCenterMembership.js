'use strict';
class CertificationCenterMembership {
  constructor({ id, certificationCenter, user, createdAt, disabledAt, isReferer } = {}) {
    this.id = id;
    this.certificationCenter = certificationCenter;
    this.user = user;
    this.createdAt = createdAt;
    this.disabledAt = disabledAt;
    this.isReferer = isReferer;
  }
}

module.exports = CertificationCenterMembership;
