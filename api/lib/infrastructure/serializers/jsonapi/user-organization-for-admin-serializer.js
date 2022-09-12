const { Serializer } = require('jsonapi-serializer');

module.exports = {
  serialize(organization) {
    return new Serializer('user-organization', {
      attributes: [
        'id',
        'updatedAt',
        'role',
        'disabledAt',
        'organizationId',
        'organizationName',
        'organizationType',
        'organizationExternalId',
      ],
    }).serialize(organization);
  },
};
