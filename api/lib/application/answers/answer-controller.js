import * as answerSerializer from '../../infrastructure/serializers/jsonapi/answer-serializer.js';
import * as correctionSerializer from '../../infrastructure/serializers/jsonapi/correction-serializer.js';
import { usecases } from '../../domain/usecases/index.js';
import * as requestResponseUtils from '../../infrastructure/utils/request-response-utils.js';

const save = async function (request, h, dependencies = { answerSerializer, requestResponseUtils }) {
  const answer = dependencies.answerSerializer.deserialize(request.payload);
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);
  const createdAnswer = await usecases.correctAnswerThenUpdateAssessment({ answer, userId, locale });

  return h.response(dependencies.answerSerializer.serialize(createdAnswer)).created();
};

const get = async function (request, _h, dependencies = { requestResponseUtils }) {
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const answerId = request.params.id;
  const answer = await usecases.getAnswer({ answerId, userId });

  return answerSerializer.serialize(answer);
};

const update = async function (request, _h, dependencies = { requestResponseUtils }) {
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const answerId = request.params.id;
  const answer = await usecases.getAnswer({ answerId, userId });

  return answerSerializer.serialize(answer);
};

const find = async function (request, _h, dependencies = { requestResponseUtils }) {
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const { challengeId, challengePreviewId, assessmentId } = request.query;
  let answers = [];
  if (assessmentId) {
    if (challengeId) {
      answers = await usecases.findAnswerByChallengeAndAssessment({ challengeId, assessmentId, userId });
    } else if (challengePreviewId) {
      answers = await usecases.findAnswerByChallengePreviewAndAssessment({ challengePreviewId, assessmentId, userId });
    } else {
      answers = await usecases.findAnswerByAssessment({ assessmentId, userId });
    }
  }

  return answerSerializer.serialize(answers);
};

const getCorrection = async function (request, _h, dependencies = { correctionSerializer, requestResponseUtils }) {
  const userId = dependencies.requestResponseUtils.extractUserIdFromRequest(request);
  const locale = dependencies.requestResponseUtils.extractLocaleFromRequest(request);
  const answerId = request.params.id;

  const correction = await usecases.getCorrectionForAnswer({
    answerId,
    userId,
    locale,
  });

  return dependencies.correctionSerializer.serialize(correction);
};

const answerController = { save, get, update, find, getCorrection };

export { answerController };
