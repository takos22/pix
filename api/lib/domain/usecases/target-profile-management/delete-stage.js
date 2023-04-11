const deleteStage = function ({ stageCollection, stageId, targetProfileId }) {
  return stageCollection.findStage(stageId, targetProfileId);
};

export { deleteStage };
