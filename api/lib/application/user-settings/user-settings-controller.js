const usecases = require('../../domain/usecases');

const UserSettingsSerializer = require('../../infrastructure/serializers/jsonapi/user-settings-serializer');

module.exports = {
  async getUserSettings(request, h) {
    const { userId } = request.params;

    const userSettings = await usecases.getUserSettings({ userId });

    return h.response(UserSettingsSerializer.serialize(userSettings));
  },
  async updateUserColor(request, h) {
    const { userId } = request.auth.credentials;
    const { color } = UserSettingsSerializer.deserialize(request.payload);

    const updatedUserSettings = await usecases.updateUserColor({ userId, color });

    return h.response(UserSettingsSerializer.serialize(updatedUserSettings)).created();
  },
};
