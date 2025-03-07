import jsonapiSerializer from 'jsonapi-serializer';

const { Serializer } = jsonapiSerializer;

import { tutorialAttributes } from './tutorial-attributes.js';
import { TutorialEvaluation } from '../../../domain/models/TutorialEvaluation.js';

const serialize = function (tutorialEvaluation) {
  return new Serializer('tutorial-evaluation', {
    attributes: ['tutorial', 'userId', 'tutorialId', 'status', 'updatedAt'],
    tutorial: tutorialAttributes,
  }).serialize(tutorialEvaluation);
};

const deserialize = function (json) {
  return new TutorialEvaluation({
    id: json?.data.id,
    userId: json?.data.attributes['user-id'],
    tutorialId: json?.data.attributes['tutorial-id'],
    status: json?.data.attributes.status,
  });
};

export { serialize, deserialize };
