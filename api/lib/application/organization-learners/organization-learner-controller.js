const usecases = require('../../domain/usecases');
const organizationLearnerIdentitySerializer = require('../../infrastructure/serializers/jsonapi/organization-learner-identity-serializer');
const organizationLearnerSerializer = require('../../infrastructure/serializers/jsonapi/organization-learner-serializer');

module.exports = {
  async dissociate(request, h) {
    const organizationLearnerId = request.params.id;
    await usecases.dissociateUserFromOrganizationLearner({ organizationLearnerId });
    return h.response().code(204);
  },

  async findAssociation(request, h) {
    const authenticatedUserId = request.auth.credentials.userId;
    // eslint-disable-next-line no-restricted-syntax
    const requestedUserId = parseInt(request.query.userId);
    const campaignCode = request.query.campaignCode;

    const organizationLearner = await usecases.findAssociationBetweenUserAndOrganizationLearner({
      authenticatedUserId,
      requestedUserId,
      campaignCode,
    });

    return h.response(organizationLearnerIdentitySerializer.serialize(organizationLearner)).code(200);
  },

  async get(request) {
    const learner = await usecases.getLearner({
      id: request.params.learnerId,
      organizationId: request.params.id,
    });

    return organizationLearnerSerializer.serialize(learner);
  },
};
