import * as knowledgeElementRepository from '../../infrastructure/repositories/knowledge-element-repository.js';
import * as scoringService from './scoring/scoring-service.js';

const getCompetenceLevel = async function ({ userId, competenceId, domainTransaction }) {
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserIdAndCompetenceId({
    userId,
    competenceId,
    domainTransaction,
  });
  const { currentLevel } = scoringService.calculateScoringInformationForCompetence({ knowledgeElements });
  return currentLevel;
};

export { getCompetenceLevel };
