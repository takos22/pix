const TABLE_NAME = 'user-settings';
const COLUMN_NAME = 'color';

exports.up = async function (knex) {
  await knex.schema.createTable(TABLE_NAME, function (table) {
    table.increments().primary();
    table.string(COLUMN_NAME).nullable();
    table.integer('userId').unsigned().unique().notNullable().references('users.id');
    table.dateTime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.dateTime('updatedAt').notNullable().defaultTo(knex.fn.now());
  });
};
exports.down = async function (knex) {
  await knex.schema.dropTable(TABLE_NAME);
};
