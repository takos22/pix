// Make sure you properly test your migration, especially DDL (Data Definition Language)
// ! If the target table is large, and the migration take more than 20 minutes, the deployment will fail !

// You can design and test your migration to avoid this by following this guide
// https://1024pix.atlassian.net/wiki/spaces/DEV/pages/2153512965/Cr+er+une+migration

// If your migrations target `answers` or `knowledge-elements`
// contact @team-captains, because automatic migrations are not active on `pix-datawarehouse-production`
// this may prevent data replication to succeed the day after your migration is deployed on `pix-api-production`
const TARGET_PROFILES = 'target-profiles';
const ARE_KNOWLEDGE_ELEMENTS_RESETTABLE = 'areKnowledgeElementsResettable';

const up = async function (knex) {
  await knex.schema.table(TARGET_PROFILES, function (table) {
    table.boolean(ARE_KNOWLEDGE_ELEMENTS_RESETTABLE).defaultTo(false);
  });
};

const down = async function (knex) {
  await knex.schema.table(TARGET_PROFILES, function (table) {
    table.dropColumn(ARE_KNOWLEDGE_ELEMENTS_RESETTABLE);
  });
};

export { up, down };
