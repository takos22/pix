const getUserSettings = async function ({ userId, userSettingsRepository }) {
  return userSettingsRepository.get(userId);
};

export { getUserSettings };
