import * as scorecardSerializer from '../../infrastructure/serializers/jsonapi/scorecard-serializer.js';
import * as tutorialSerializer from '../../infrastructure/serializers/jsonapi/tutorial-serializer.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';

const getScorecard = function (request) {
  const locale = extractLocaleFromRequest(request);
  const authenticatedUserId = request.auth.credentials.userId;
  const scorecardId = request.params.id;

  return usecases.getScorecard({ authenticatedUserId, scorecardId, locale }).then(scorecardSerializer.serialize);
};

const findTutorials = function (request) {
  const locale = extractLocaleFromRequest(request);
  const authenticatedUserId = request.auth.credentials.userId;
  const scorecardId = request.params.id;

  return usecases.findTutorials({ authenticatedUserId, scorecardId, locale }).then(tutorialSerializer.serialize);
};

export { getScorecard, findTutorials };
