import bluebird from 'bluebird';
import { v4 as uuidv4 } from 'uuid';
import settings from '../../config';
import tokenService from './token-service';
import { UnauthorizedError } from '../../application/http-errors';
import temporaryStorage from '../../infrastructure/temporary-storage';

const refreshTokenTemporaryStorage = temporaryStorage.withPrefix('refresh-tokens:');
const userRefreshTokensTemporaryStorage = temporaryStorage.withPrefix('user-refresh-tokens:');

const REFRESH_TOKEN_EXPIRATION_DELAY_ADDITION_SECONDS = 60 * 60; // 1 hour

function _prefixForUser(userId) {
  return `${userId}:`;
}

async function createRefreshTokenFromUserId({ userId, source, uuidGenerator = uuidv4 }) {
  const expirationDelaySeconds = settings.authentication.refreshTokenLifespanMs / 1000;
  const refreshToken = `${_prefixForUser(userId)}${uuidGenerator()}`;

  await refreshTokenTemporaryStorage.save({
    key: refreshToken,
    value: { type: 'refresh_token', userId, source },
    expirationDelaySeconds,
  });
  await userRefreshTokensTemporaryStorage.lpush({ key: userId, value: refreshToken });
  await userRefreshTokensTemporaryStorage.expire({
    key: userId,
    expirationDelaySeconds: expirationDelaySeconds + REFRESH_TOKEN_EXPIRATION_DELAY_ADDITION_SECONDS,
  });

  return refreshToken;
}

async function createAccessTokenFromRefreshToken({ refreshToken }) {
  const { userId, source } = (await refreshTokenTemporaryStorage.get(refreshToken)) || {};
  if (!userId) throw new UnauthorizedError('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
  return tokenService.createAccessTokenFromUser(userId, source);
}

async function revokeRefreshToken({ refreshToken }) {
  const { userId } = (await refreshTokenTemporaryStorage.get(refreshToken)) || {};
  if (!userId) return;
  await userRefreshTokensTemporaryStorage.lrem({ key: userId, valueToRemove: refreshToken });
  await refreshTokenTemporaryStorage.delete(refreshToken);
}

async function revokeRefreshTokensForUserId({ userId }) {
  const refreshTokens = await userRefreshTokensTemporaryStorage.lrange(userId);
  await userRefreshTokensTemporaryStorage.delete(userId);
  await bluebird.mapSeries(refreshTokens, (refreshToken) => {
    return refreshTokenTemporaryStorage.delete(refreshToken);
  });
}

export default {
  createRefreshTokenFromUserId,
  createAccessTokenFromRefreshToken,
  revokeRefreshToken,
  revokeRefreshTokensForUserId,

  refreshTokenTemporaryStorageForTests: refreshTokenTemporaryStorage,
  userRefreshTokensTemporaryStorageForTests: userRefreshTokensTemporaryStorage,
};
