import { usecases } from '../../domain/usecases/index.js';
import * as organizationLearnerIdentitySerializer from '../../infrastructure/serializers/jsonapi/organization-learner-identity-serializer.js';
import * as organizationLearnerActivitySerializer from '../../infrastructure/serializers/jsonapi/organization-learner-activity-serializer.js';
import * as organizationLearnerSerializer from '../../infrastructure/serializers/jsonapi/organization-learner-follow-up/organization-learner-serializer.js';

const dissociate = async function (request, h) {
  const organizationLearnerId = request.params.id;
  await usecases.dissociateUserFromOrganizationLearner({ organizationLearnerId });
  return h.response().code(204);
};

const findAssociation = async function (request, h) {
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
};

const getActivity = async function (request, h) {
  const organizationLearnerId = request.params.id;
  const activity = await usecases.getOrganizationLearnerActivity({ organizationLearnerId });
  return h.response(organizationLearnerActivitySerializer.serialize(activity)).code(200);
};

const getLearner = async function (request, h) {
  const organizationLearnerId = request.params.id;
  const learner = await usecases.getOrganizationLearner({ organizationLearnerId });
  return h.response(organizationLearnerSerializer.serialize(learner)).code(200);
};

export { dissociate, findAssociation, getActivity, getLearner };
