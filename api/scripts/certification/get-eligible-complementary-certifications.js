'use strict';
require('dotenv').config();

const logger = require('../../lib/infrastructure/logger');
const certificationBadgesService = require('../../lib/domain/services/certification-badges-service');
const cache = require('../../lib/infrastructure/caches/learning-content-cache');
const { knex, disconnect } = require('../../db/knex-database-connection');

/**
 * Usage: LOG_LEVEL=info node scripts/certification/get-eligible-complementary-certifications.js 1234
 */
async function main() {
  logger.info("Début du script de récupération à l'éligibilité des certifications complémentaires.");

  if (process.argv.length <= 2) {
    logger.info('Usage: node scripts/certification/get-eligible-complementary-certifications.js 1234');
    return;
  }

  const userId = process.argv[2];
  const badgesAcquisition = await certificationBadgesService.findStillValidBadgeAcquisitions({
    userId,
  });

  const complementaryCertificationLabels = badgesAcquisition.map((badgeAcquisition) => ({
    badgeKey: badgeAcquisition.badge.key,
    complementaryCertificationLabel: badgeAcquisition.complementaryCertification.label,
  }));

  if (complementaryCertificationLabels.length) {
    console.table(complementaryCertificationLabels);
  } else {
    console.warn("Pas d'éligibilité aux certifications complémentaires");

    const resetCompetences = await knex
      .select('competenceId')
      .max('createdAt')
      .from('knowledge-elements')
      .where({ userId, status: 'reset' })
      .groupBy('competenceId');
    if (resetCompetences.length) {
      const formatedReset = resetCompetences.map(
        ({ competenceId, max }) =>
          `Competence: ${competenceId} - Date de reset: ${new Date(max).toLocaleDateString('fr-FR')}`
      );
      console.log(`${resetCompetences.length} competences reset:`, formatedReset);
    } else {
      console.log('Pas de reset sur les compétences');
    }
  }
  logger.info('Fin du script.');
}

(async () => {
  if (require.main === module) {
    try {
      await main();
    } catch (error) {
      logger.error(error);
      process.exitCode = 1;
    } finally {
      await disconnect();
      await cache.quit();
    }
  }
})();
