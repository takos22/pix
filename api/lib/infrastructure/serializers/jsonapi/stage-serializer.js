import { Serializer } from 'jsonapi-serializer';

const serialize = function (stage = {}) {
  return new Serializer('stage', {
    ref: 'id',
    attributes: ['message', 'threshold', 'level', 'title', 'prescriberTitle', 'prescriberDescription'],
  }).serialize(stage);
};

const deserialize = function (json) {
  const stringId = json.data?.id;
  return {
    id: stringId ? parseInt(stringId) : stringId,
    title: json.data.attributes.title,
    message: json.data.attributes.message,
    threshold: json.data.attributes.threshold,
    level: json.data.attributes.level,
    targetProfileId: json.data.relationships['target-profile']?.data.id,
    prescriberTitle: json.data.attributes['prescriber-title'],
    prescriberDescription: json.data.attributes['prescriber-description'],
  };
};

export { serialize, deserialize };
