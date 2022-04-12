const { buildUser } = require('./build-user');
const databaseBuffer = require('../database-buffer');

const buildUserSettings = function ({ id = databaseBuffer.getNextId(), color = 'red', userId = buildUser().id } = {}) {
  const values = {
    id,
    color,
    userId,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'user-settings',
    values,
  });
};

module.exports = buildUserSettings;
