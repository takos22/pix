import { badges } from '../constants.js';
const {
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
} = badges.keys;

const pixEduBadges = [
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_INITIE,
  PIX_EDU_FORMATION_INITIALE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_CONFIRME,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_AVANCE,
  PIX_EDU_FORMATION_CONTINUE_2ND_DEGRE_EXPERT,
]
  .map((badge) => `'${badge}'`)
  .join(',');

const up = async function (knex) {
  await knex.schema.alterTable('partner-certifications', function (table) {
    table.string('partnerKey').nullable().alter();
    table.string('temporaryPartnerKey').references('badges.key').nullable();
  });

  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(
    `UPDATE "partner-certifications" SET "temporaryPartnerKey" = "partnerKey", "partnerKey" = NULL WHERE "partnerKey" IN (${pixEduBadges})`,
  );
};

const down = async function (knex) {
  // eslint-disable-next-line knex/avoid-injections
  await knex.raw(
    `UPDATE "partner-certifications" SET "partnerKey" = "temporaryPartnerKey" WHERE "temporaryPartnerKey" IN (${pixEduBadges})`,
  );

  await knex.schema.alterTable('partner-certifications', function (table) {
    table.dropColumn('temporaryPartnerKey');
    table.string('partnerKey').notNullable().alter();
  });
};

export { up, down };
