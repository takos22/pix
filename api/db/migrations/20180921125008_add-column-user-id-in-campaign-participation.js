const TABLE_NAME = 'campaign-participations';

exports.up = function(knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.integer('userId').unsigned().references('users.id').index();
  });
};

exports.down = function(knex) {
  return knex.schema.table(TABLE_NAME, (table) => {
    table.dropColumn('userId');
  });
};
