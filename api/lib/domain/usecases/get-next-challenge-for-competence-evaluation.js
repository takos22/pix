import { AssessmentEndedError, UserNotAuthorizedToAccessEntityError } from '../errors.js';
import { smartRandom } from '../services/algorithm-methods/smart-random.js';
import { dataFetcher } from '../services/algorithm-methods/data-fetcher.js';

const getNextChallengeForCompetenceEvaluation = async function ({ pickChallengeService, assessment, userId, locale }) {
  _checkIfAssessmentBelongsToUser(assessment, userId);
  const inputValues = await dataFetcher.fetchForCompetenceEvaluations(...arguments);

  const { possibleSkillsForNextChallenge, hasAssessmentEnded } = smartRandom.getPossibleSkillsForNextChallenge({
    ...inputValues,
    locale,
  });

  if (hasAssessmentEnded) {
    throw new AssessmentEndedError();
  }

  return pickChallengeService.pickChallenge({
    skills: possibleSkillsForNextChallenge,
    randomSeed: assessment.id,
    locale: locale,
  });
};

export { getNextChallengeForCompetenceEvaluation };

function _checkIfAssessmentBelongsToUser(assessment, userId) {
  if (assessment.userId !== userId) {
    throw new UserNotAuthorizedToAccessEntityError();
  }
}
