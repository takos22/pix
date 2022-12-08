const UserSettings = require('../models/UserSettings');

module.exports = async function updateUserColor({ userId, color, userSettingsRepository }) {
  let userSettings;

  try {
    userSettings = await userSettingsRepository.get(userId);
  } catch (e) {
    userSettings = new UserSettings({ userId });
  }

  userSettings.color = color;

  return userSettingsRepository.save(userSettings);
};
