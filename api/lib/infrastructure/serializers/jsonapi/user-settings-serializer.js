const { Serializer } = require('jsonapi-serializer');

module.exports = {
  deserialize(payload) {
    return {
      color: payload.data.attributes.color,
    };
  },
  serialize(userSettings = {}) {
    return new Serializer('user-setting', {
      attributes: ['color', 'createdAt', 'updatedAt'],
    }).serialize(userSettings);
  },
};
