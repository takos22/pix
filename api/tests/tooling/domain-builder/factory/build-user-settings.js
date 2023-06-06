import { UserSettings } from '../../../../lib/domain/models/UserSettings.js';

const buildUserSettings = function ({ userId, color = 'red' } = {}) {
  return new UserSettings({
    userId,
    color,
  });
};

export { buildUserSettings };
