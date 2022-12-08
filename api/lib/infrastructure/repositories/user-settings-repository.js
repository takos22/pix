const UserSettings = require('../../domain/read-models/UserSettings');
const { knex } = require('../../../db/knex-database-connection');
const { NotFoundError } = require('../../domain/errors');

async function save(userSettings) {
  const [rawUserSettings] = await knex('user-settings')
    .insert({ ...userSettings, updatedAt: knex.fn.now() })
    .onConflict(['userId'])
    .merge()
    .returning('*');
  return new UserSettings(rawUserSettings);
}

async function get(userId) {
  const userSettings = await knex('user-settings').where({ userId }).first();
  if (!userSettings) {
    throw new NotFoundError('User settings not found');
  }
  return new UserSettings(userSettings);
}

module.exports = {
  save,
  get,
};
