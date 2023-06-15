const TABLE_NAME = 'activity-answers';

const up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments().primary();
    t.integer('activityId').references('activities.id');
    t.integer('answerId').references('answers.id');
  });
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { up, down };
