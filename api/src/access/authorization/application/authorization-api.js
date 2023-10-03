import { assertNotNullOrUndefined } from '../../../shared/domain/models/asserts.js';

const MISSING_USER_ROLE_ERROR_MESSAGE = 'User Role is not defined';
const MISSING_USER_ID_ERROR_MESSAGE = 'User Id is not defined';
const MISSING_APPLICATION_ID_ERROR_MESSAGE = 'Application Id is not defined';

class AuthorizationContext {
  constructor({ role, userId, applicationId }) {
    assertNotNullOrUndefined(role, MISSING_USER_ROLE_ERROR_MESSAGE);
    assertNotNullOrUndefined(userId, MISSING_USER_ID_ERROR_MESSAGE);
    assertNotNullOrUndefined(applicationId, MISSING_APPLICATION_ID_ERROR_MESSAGE);

    this.role = role;
    this.userId = userId;
    this.applicationId = applicationId;
  }
}

/**
 * @param {string} role
 * @param {number} userId
 * @param {string} applicationId
 * @returns boolean
 */
async function checkUserRoleForApplication({ role, userId, applicationId }) {
  new AuthorizationContext({ role, userId, applicationId });

  return true;
}

export { AuthorizationContext, checkUserRoleForApplication };
