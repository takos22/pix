import { usecases } from '../../domain/usecases/index.js';
import * as userSavedTutorialSerializer from '../../infrastructure/serializers/jsonapi/user-saved-tutorial-serializer.js';
import * as tutorialSerializer from '../../infrastructure/serializers/jsonapi/tutorial-serializer.js';
import * as userSavedTutorialRepository from '../../infrastructure/repositories/user-saved-tutorial-repository.js';
import { extractParameters } from '../../infrastructure/utils/query-params-utils.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const add = async function (request, h) {
  const { userId } = request.auth.credentials;
  const { tutorialId } = request.params;
  const userSavedTutorial = userSavedTutorialSerializer.deserialize(request.payload);

  const createdUserSavedTutorial = await usecases.addTutorialToUser({ ...userSavedTutorial, userId, tutorialId });

  return h.response(userSavedTutorialSerializer.serialize(createdUserSavedTutorial)).created();
};

const find = async function (request) {
  const { userId } = request.auth.credentials;
  const { page, filter: filters } = extractParameters(request.query);
  const locale = extractLocaleFromRequest(request);
  const { tutorials, meta } = await usecases.findPaginatedFilteredTutorials({
    userId,
    filters,
    page,
    locale,
  });
  return tutorialSerializer.serialize(tutorials, meta);
};

const removeFromUser = async function (request, h) {
  const { userId } = request.auth.credentials;
  const { tutorialId } = request.params;

  await userSavedTutorialRepository.removeFromUser({ userId, tutorialId });

  return h.response().code(204);
};

export { add, find, removeFromUser };
