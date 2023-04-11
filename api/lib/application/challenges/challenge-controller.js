import * as challengeRepository from '../../infrastructure/repositories/challenge-repository.js';
import * as challengeSerializer from '../../infrastructure/serializers/jsonapi/challenge-serializer.js';

const get = function (request) {
  return challengeRepository.get(request.params.id).then((challenge) => challengeSerializer.serialize(challenge));
};

export { get };
