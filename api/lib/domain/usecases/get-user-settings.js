module.exports = async function getUserSettings({ userId, userSettingsRepository }) {
  return userSettingsRepository.get(userId);
};
