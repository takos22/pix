import * as trainingSerializer from '../../infrastructure/serializers/jsonapi/training-serializer.js';
import * as trainingSummarySerializer from '../../infrastructure/serializers/jsonapi/training-summary-serializer.js';
import * as trainingTriggerSerializer from '../../infrastructure/serializers/jsonapi/training-trigger-serializer.js';
import * as targetProfileSummaryForAdminSerializer from '../../infrastructure/serializers/jsonapi/target-profile-summary-for-admin-serializer.js';
import { usecases } from '../../domain/usecases/index.js';
import { queryParamsUtils } from '../../infrastructure/utils/query-params-utils.js';

const findPaginatedTrainingSummaries = async function (request) {
  const { page } = queryParamsUtils.extractParameters(request.query);
  const { trainings, meta } = await usecases.findPaginatedTrainingSummaries({ page });
  return trainingSummarySerializer.serialize(trainings, meta);
};

const findTargetProfileSummaries = async function (request) {
  const { trainingId } = request.params;
  const targetProfileSummaries = await usecases.findTargetProfileSummariesForTraining({ trainingId });
  return targetProfileSummaryForAdminSerializer.serialize(targetProfileSummaries);
};

const getById = async function (request) {
  const { trainingId } = request.params;
  const training = await usecases.getTraining({ trainingId });
  return trainingSerializer.serializeForAdmin(training);
};

const create = async function (request, h) {
  const deserializedTraining = await trainingSerializer.deserialize(request.payload);
  const createdTraining = await usecases.createTraining({ training: deserializedTraining });
  return h.response(trainingSerializer.serialize(createdTraining)).created();
};

const update = async function (request) {
  const { trainingId } = request.params;
  const training = await trainingSerializer.deserialize(request.payload);
  const updatedTraining = await usecases.updateTraining({ training: { ...training, id: trainingId } });
  return trainingSerializer.serialize(updatedTraining);
};

const createOrUpdateTrigger = async function (request) {
  const { trainingId } = request.params;
  const { threshold, tubes, type } = await trainingTriggerSerializer.deserialize(request.payload);
  const createdOrUpdatedTrainingTrigger = await usecases.createOrUpdateTrainingTrigger({
    trainingId,
    threshold,
    tubes,
    type,
  });
  return trainingTriggerSerializer.serialize(createdOrUpdatedTrainingTrigger);
};

const attachTargetProfiles = async function (request, h) {
  const { id: trainingId } = request.params;
  const targetProfileIds = request.payload['target-profile-ids'];
  await usecases.attachTargetProfilesToTraining({
    trainingId,
    targetProfileIds,
  });
  return h.response({}).code(204);
};

export {
  findPaginatedTrainingSummaries,
  findTargetProfileSummaries,
  getById,
  create,
  update,
  createOrUpdateTrigger,
  attachTargetProfiles,
};
