const UserSettings = require('../../../../lib/domain/models/UserSettings');

function buildUserSettings({ userId, color = 'red' } = {}) {
  return new UserSettings({
    userId,
    color,
  });
}

module.exports = buildUserSettings;
