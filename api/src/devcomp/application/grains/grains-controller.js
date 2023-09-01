import * as grainSerializer from '../../infrastructure/serializers/json-api/grain-serializer.js';
import { usecases } from '../../domain/usecases/index.js';

const get = async function (request, h, dependencies = { grainSerializer, usecases }) {
  const { id } = request.params;
  const createdAnswer = await dependencies.usecases.getGrain({ id });

  return dependencies.grainSerializer.serialize(createdAnswer);
};

const grainsController = { get };

export { grainsController };
