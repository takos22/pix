import jsonwebtoken from 'jsonwebtoken';
import { settings } from '../../config.js';
import * as passwordResetDemandRepository from '../../infrastructure/repositories/reset-password-demands-repository.js';
import crypto from 'crypto';

const generateTemporaryKey = function () {
  return jsonwebtoken.sign(
    {
      data: crypto.randomBytes(16).toString('base64'),
    },
    settings.temporaryKey.secret,
    { expiresIn: settings.temporaryKey.tokenLifespan }
  );
};

const invalidateOldResetPasswordDemand = function (userEmail) {
  return passwordResetDemandRepository.markAsBeingUsed(userEmail);
};

const verifyDemand = function (temporaryKey) {
  return passwordResetDemandRepository.findByTemporaryKey(temporaryKey).then((fetchedDemand) => fetchedDemand.toJSON());
};

const hasUserAPasswordResetDemandInProgress = function (email, temporaryKey) {
  return passwordResetDemandRepository.findByUserEmail(email, temporaryKey);
};

export { generateTemporaryKey, invalidateOldResetPasswordDemand, verifyDemand, hasUserAPasswordResetDemandInProgress };
