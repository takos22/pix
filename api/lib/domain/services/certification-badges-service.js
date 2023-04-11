import _ from 'lodash';
import bluebird from 'bluebird';
import * as certifiableBadgeAcquisitionRepository from '../../infrastructure/repositories/certifiable-badge-acquisition-repository.js';
import * as knowledgeElementRepository from '../../infrastructure/repositories/knowledge-element-repository.js';
import * as badgeForCalculationRepository from '../../infrastructure/repositories/badge-for-calculation-repository.js';

const findStillValidBadgeAcquisitions = async function ({ userId, domainTransaction }) {
  const highestCertifiableBadgeAcquisitions = await certifiableBadgeAcquisitionRepository.findHighestCertifiable({
    userId,
    domainTransaction,
  });

  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId, domainTransaction });

  const badgeAcquisitions = await bluebird.mapSeries(
    highestCertifiableBadgeAcquisitions,
    async (certifiableBadgeAcquisition) => {
      const badgeForCalculation = await badgeForCalculationRepository.getByCertifiableBadgeAcquisition({
        certifiableBadgeAcquisition,
      });
      if (!badgeForCalculation) return null;
      const isBadgeValid = badgeForCalculation.shouldBeObtained(knowledgeElements);
      return isBadgeValid ? certifiableBadgeAcquisition : null;
    }
  );

  return _.compact(badgeAcquisitions);
};

export { findStillValidBadgeAcquisitions };
