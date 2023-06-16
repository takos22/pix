import * as challengeRepository from '../../infrastructure/repositories/challenge-repository.js';
import * as challengeSerializer from '../../infrastructure/serializers/jsonapi/challenge-serializer.js';

const get = async function (request, h, dependencies = { challengeRepository, challengeSerializer }) {
  const challenge = await dependencies.challengeRepository.get(request.params.id);
  return dependencies.challengeSerializer.serialize(challenge);
};

async function createPreview(request, h, dependencies = { challengeRepository }) {
  const { id } = await dependencies.challengeRepository.createPreview(request.payload);
  return h.response({ id }).code(201);
}

const challengeController = { get, createPreview };

export { challengeController };
