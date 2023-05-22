const TABLE_NAME = 'tutorial-evaluations';

const up = function (knex) {
  return knex.schema.createTable(TABLE_NAME, (t) => {
    t.increments('id').primary();
    t.bigInteger('userId').notNullable().index();
    t.string('tutorialId').notNullable().index();
    t.unique(['userId', 'tutorialId']);
    t.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    t.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};

const down = function (knex) {
  return knex.schema.dropTable(TABLE_NAME);
};

export { up, down };
