import { TrainingSummary as Training } from '../../../../lib/domain/read-models/TrainingSummary.js';

const buildTrainingSummary = function ({ id = 1, title = 'Training Summary 1' } = {}) {
  return new Training({
    id,
    title,
  });
};

export { buildTrainingSummary };
