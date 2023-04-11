import { usecases } from '../../domain/usecases/index.js';
import * as toBePublishedSessionSerializer from '../../infrastructure/serializers/jsonapi/to-be-published-session-serializer.js';
import * as withRequiredActionSessionSerializer from '../../infrastructure/serializers/jsonapi/with-required-action-session-serializer.js';

const findFinalizedSessionsToPublish = async function () {
  const finalizedSessionsToPublish = await usecases.findFinalizedSessionsToPublish();
  return toBePublishedSessionSerializer.serialize(finalizedSessionsToPublish);
};

const findFinalizedSessionsWithRequiredAction = async function () {
  const finalizedSessionsWithRequiredAction = await usecases.findFinalizedSessionsWithRequiredAction();
  return withRequiredActionSessionSerializer.serialize(finalizedSessionsWithRequiredAction);
};

export { findFinalizedSessionsToPublish, findFinalizedSessionsWithRequiredAction };
