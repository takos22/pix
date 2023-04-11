const createStage = function ({ stage, stageCollection }) {
  stageCollection.addStage(stage);
  return stageCollection;
};

export { createStage };
