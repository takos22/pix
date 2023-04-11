import { Serializer } from 'jsonapi-serializer';

const serialize = function (trainingSummaries, meta) {
  return new Serializer('training-summaries', {
    attributes: ['title'],
    meta,
  }).serialize(trainingSummaries);
};

export { serialize };
