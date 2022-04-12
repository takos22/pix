import { usecases } from '../../domain/usecases/index.js';

import * as userSettingsSerializer from '../../infrastructure/serializers/jsonapi/user-settings-serializer.js';

async function getUserSettings(request, h, dependencies = { userSettingsSerializer }) {
  const { userId } = request.params;

  const userSettings = await usecases.getUserSettings({ userId });

  return h.response(dependencies.userSettingsSerializer.serialize(userSettings));
}

async function updateUserColor(request, h, dependencies = { userSettingsSerializer }) {
  const { userId } = request.auth.credentials;
  const { color } = userSettingsSerializer.deserialize(request.payload);

  const updatedUserSettings = await usecases.updateUserColor({ userId, color });

  return h.response(dependencies.userSettingsSerializer.serialize(updatedUserSettings)).created();
}

const userSettingsController = {
  getUserSettings,
  updateUserColor,
};

export { userSettingsController };
