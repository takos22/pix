import { databaseBuffer } from '../database-buffer.js';

const buildActivityAnswer = function ({ id = databaseBuffer.getNextId(), activityId, answerId } = {}) {
  const values = {
    id,
    activityId,
    answerId,
  };
  return databaseBuffer.pushInsertable({
    tableName: 'activity-answers',
    values,
  });
};

export { buildActivityAnswer };
