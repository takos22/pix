// Make sure you properly test your migration, especially DDL (Data Definition Language)
// ! If the target table is large, and the migration take more than 20 minutes, the deployment will fail !

// You can design and test your migration to avoid this by following this guide
// https://1024pix.atlassian.net/wiki/spaces/DEV/pages/2153512965/Cr+er+une+migration

// If your migrations target `answers` or `knowledge-elements`
// contact @team-captains, because automatic migrations are not active on `pix-datawarehouse-production`
// this may prevent data replication to succeed the day after your migration is deployed on `pix-api-production`
const TABLE_NAME = 'campaigns';
const COLUMN_NAME = 'type';

const up = async function (knex) {
  await knex(TABLE_NAME).update(COLUMN_NAME, 'ASSESSMENT').where(COLUMN_NAME, '');
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string(COLUMN_NAME).notNullable().alter();
  });
};

const down = async function (knex) {
  await knex.schema.table(TABLE_NAME, function (table) {
    table.string(COLUMN_NAME).notNullable().defaultTo('').alter();
  });
};

export { up, down };
