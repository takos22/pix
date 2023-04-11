import _ from 'lodash';
import * as membershipRepository from '../../infrastructure/repositories/membership-repository.js';

const execute = function (userId, organizationId) {
  return membershipRepository
    .findByUserIdAndOrganizationId({ userId, organizationId })
    .then((memberships) => !_.isEmpty(memberships));
};

export { execute };
