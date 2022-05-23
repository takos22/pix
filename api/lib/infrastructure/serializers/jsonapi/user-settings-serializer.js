const { Serializer } = require('jsonapi-serializer');

module.exports = {
  deserialize() {},
  serialize() {
    return new Serializer().serialize();
  },
};
