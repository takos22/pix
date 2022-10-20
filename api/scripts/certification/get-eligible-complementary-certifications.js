'use strict';
require('dotenv').config();

const logger = require('../../lib/infrastructure/logger');
const certificationBadgesService = require('../../lib/domain/services/certification-badges-service');
const cache = require('../../lib/infrastructure/caches/learning-content-cache');
const { disconnect } = require('../../db/knex-database-connection');

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

  const complementaryCertificationLabel = badgesAcquisition.map((badgeAcquisition) => ({
    badgeKey: badgeAcquisition.badge.key,
    complementaryCertificationLabel: badgeAcquisition.complementaryCertification.label,
  }));

  console.table(complementaryCertificationLabel);

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
