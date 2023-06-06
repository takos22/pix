import { UserSettings } from '../../domain/read-models/UserSettings.js';
import { knex } from '../../../db/knex-database-connection.js';
import { NotFoundError } from '../../domain/errors.js';

const userSettingsRepository = {
  async save(userSettings) {
    const [rawUserSettings] = await knex('user-settings')
      .insert({ ...userSettings, updatedAt: knex.fn.now() })
      .onConflict(['userId'])
      .merge()
      .returning('*');
    return new UserSettings(rawUserSettings);
  },

  async get(userId) {
    const userSettings = await knex('user-settings').where({ userId }).first();
    if (!userSettings) {
      throw new NotFoundError('User settings not found');
    }
    return new UserSettings(userSettings);
  },
};

export { userSettingsRepository };
