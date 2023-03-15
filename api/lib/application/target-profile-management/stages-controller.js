import _ from 'lodash';
import { usecases } from '../../domain/usecases/index.js';
import * as stageSerializer from '../../infrastructure/serializers/jsonapi/stage-serializer.js';
import * as stageCollectionRepository from '../../infrastructure/repositories/target-profile-management/stage-collection-repository.js';

const create = async function (request, h) {
  const stage = stageSerializer.deserialize(request.payload);
  const stageCollection = await stageCollectionRepository.getByTargetProfileId(stage.targetProfileId);
  const stageIdsBefore = stageCollection.stages.map((stage) => stage.id);
  const updatedStageCollection = usecases.createStage({ stageCollection, stage });
  const stageIdsAfter = await stageCollectionRepository.save(updatedStageCollection);
  const [createdStageId] = _.difference(stageIdsAfter, stageIdsBefore);
  return h.response(stageSerializer.serialize({ id: createdStageId })).created();
};

const update = async function (request, h) {
  const stage = stageSerializer.deserialize(request.payload);
  const stageCollection = await stageCollectionRepository.getByTargetProfileId(stage.targetProfileId);
  const updatedStageCollection = usecases.updateStage({ stageCollection, stage });
  await stageCollectionRepository.save(updatedStageCollection);
  return h.response({}).code(204);
};

const remove = async function (request, h) {
  const stageId = request.params.id;
  const stage = stageSerializer.deserialize(request.payload);
  const stageCollection = await stageCollectionRepository.getByTargetProfileId(stage.targetProfileId);

  const deletedStage = usecases.deleteStage({ stageCollection, targetProfileId: stage.targetProfileId, stageId });

  await stageCollectionRepository.remove(deletedStage);
  return h.response({}).code(204);
};

export { create, update, remove };
