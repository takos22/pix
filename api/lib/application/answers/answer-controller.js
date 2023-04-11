import * as answerSerializer from '../../infrastructure/serializers/jsonapi/answer-serializer.js';
import * as correctionSerializer from '../../infrastructure/serializers/jsonapi/correction-serializer.js';
import { usecases } from '../../domain/usecases/index.js';
import { requestResponseUtils } from '../../infrastructure/utils/request-response-utils.js';

const save = async function (request, h) {
  const answer = answerSerializer.deserialize(request.payload);
  const userId = requestResponseUtils.extractUserIdFromRequest(request);
  const locale = requestResponseUtils.extractLocaleFromRequest(request);
  const createdAnswer = await usecases.correctAnswerThenUpdateAssessment({ answer, userId, locale });

  return h.response(answerSerializer.serialize(createdAnswer)).created();
};

const get = async function (request) {
  const userId = requestResponseUtils.extractUserIdFromRequest(request);
  const answerId = request.params.id;
  const answer = await usecases.getAnswer({ answerId, userId });

  return answerSerializer.serialize(answer);
};

const update = async function (request) {
  const userId = requestResponseUtils.extractUserIdFromRequest(request);
  const answerId = request.params.id;
  const answer = await usecases.getAnswer({ answerId, userId });

  return answerSerializer.serialize(answer);
};

const find = async function (request) {
  const userId = requestResponseUtils.extractUserIdFromRequest(request);
  const challengeId = request.query.challengeId;
  const assessmentId = request.query.assessmentId;
  let answers = [];
  if (challengeId && assessmentId) {
    answers = await usecases.findAnswerByChallengeAndAssessment({ challengeId, assessmentId, userId });
  }
  if (assessmentId && !challengeId) {
    answers = await usecases.findAnswerByAssessment({ assessmentId, userId });
  }

  return answerSerializer.serialize(answers);
};

const getCorrection = async function (request) {
  const userId = requestResponseUtils.extractUserIdFromRequest(request);
  const locale = requestResponseUtils.extractLocaleFromRequest(request);
  const answerId = request.params.id;

  const correction = await usecases.getCorrectionForAnswer({
    answerId,
    userId,
    locale,
  });

  return correctionSerializer.serialize(correction);
};

export { save, get, update, find, getCorrection };
