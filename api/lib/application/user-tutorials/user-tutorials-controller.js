import { usecases } from '../../domain/usecases/index.js';
import * as userSavedTutorialSerializer from '../../infrastructure/serializers/jsonapi/user-saved-tutorial-serializer.js';
import * as tutorialSerializer from '../../infrastructure/serializers/jsonapi/tutorial-serializer.js';
import * as userSavedTutorialRepository from '../../infrastructure/repositories/user-saved-tutorial-repository.js';
import { extractParameters } from '../../infrastructure/utils/query-params-utils.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const add = async function (request, h, dependencies = { userSavedTutorialSerializer }) {
  const { userId } = request.auth.credentials;
  const { tutorialId } = request.params;
  const userSavedTutorial = dependencies.userSavedTutorialSerializer.deserialize(request.payload);

  const createdUserSavedTutorial = await usecases.addTutorialToUser({ ...userSavedTutorial, userId, tutorialId });

  return h.response(dependencies.userSavedTutorialSerializer.serialize(createdUserSavedTutorial)).created();
};

const find = async function (
  request,
  h,
  dependencies = { extractParameters, extractLocaleFromRequest, tutorialSerializer }
) {
  const { userId } = request.auth.credentials;
  const { page, filter: filters } = dependencies.extractParameters(request.query);
  const locale = dependencies.extractLocaleFromRequest(request);
  const { tutorials, meta } = await usecases.findPaginatedFilteredTutorials({
    userId,
    filters,
    page,
    locale,
  });
  return dependencies.tutorialSerializer.serialize(tutorials, meta);
};

const removeFromUser = async function (request, h, dependencies = { userSavedTutorialRepository }) {
  const { userId } = request.auth.credentials;
  const { tutorialId } = request.params;

  await dependencies.userSavedTutorialRepository.removeFromUser({ userId, tutorialId });

  return h.response().code(204);
};

export { add, find, removeFromUser };
