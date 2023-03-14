import * as campaignParticipationSerializer from '../../infrastructure/serializers/jsonapi/campaign-participation-serializer.js';
import * as campaignParticipationOverviewSerializer from '../../infrastructure/serializers/jsonapi/campaign-participation-overview-serializer.js';
import * as certificationEligibilitySerializer from '../../infrastructure/serializers/jsonapi/certification-eligibility-serializer.js';
import * as scorecardSerializer from '../../infrastructure/serializers/jsonapi/scorecard-serializer.js';
import * as profileSerializer from '../../infrastructure/serializers/jsonapi/profile-serializer.js';
import * as participantResultSerializer from '../../infrastructure/serializers/jsonapi/participant-result-serializer.js';
import * as sharedProfileForCampaignSerializer from '../../infrastructure/serializers/jsonapi/shared-profile-for-campaign-serializer.js';
import * as userSerializer from '../../infrastructure/serializers/jsonapi/user-serializer.js';
import * as userForAdminSerializer from '../../infrastructure/serializers/jsonapi/user-for-admin-serializer.js';
import * as userWithActivitySerializer from '../../infrastructure/serializers/jsonapi/user-with-activity-serializer.js';
import * as emailVerificationSerializer from '../../infrastructure/serializers/jsonapi/email-verification-serializer.js';
import * as userDetailsForAdminSerializer from '../../infrastructure/serializers/jsonapi/user-details-for-admin-serializer.js';
import * as userAnonymizedDetailsForAdminSerializer from '../../infrastructure/serializers/jsonapi/user-anonymized-details-for-admin-serializer.js';
import * as updateEmailSerializer from '../../infrastructure/serializers/jsonapi/update-email-serializer.js';
import * as authenticationMethodsSerializer from '../../infrastructure/serializers/jsonapi/authentication-methods-serializer.js';
import * as campaignParticipationForUserManagementSerializer from '../../infrastructure/serializers/jsonapi/campaign-participation-for-user-management-serializer.js';
import * as userOrganizationForAdminSerializer from '../../infrastructure/serializers/jsonapi/user-organization-for-admin-serializer.js';
import * as certificationCenterMembershipSerializer from '../../infrastructure/serializers/jsonapi/certification-center-membership-serializer.js';
import * as trainingSerializer from '../../infrastructure/serializers/jsonapi/training-serializer.js';
import * as userLoginSerializer from '../../infrastructure/serializers/jsonapi/user-login-serializer.js';

import { extractParameters } from '../../infrastructure/utils/query-params-utils.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';
import { usecases } from '../../domain/usecases/index.js';
import * as localeService from '../../domain/services/locale-service.js';

const save = async function (request, h) {
  const localeFromCookie = request.state?.locale;
  const canonicalLocaleFromCookie = localeFromCookie ? localeService.getCanonicalLocale(localeFromCookie) : undefined;
  const campaignCode = request.payload.meta ? request.payload.meta['campaign-code'] : null;
  const user = { ...userSerializer.deserialize(request.payload), locale: canonicalLocaleFromCookie };
  const localeFromHeader = extractLocaleFromRequest(request);

  const password = request.payload.data.attributes.password;

  const savedUser = await usecases.createUser({
    user,
    password,
    campaignCode,
    localeFromHeader,
  });

  return h.response(userSerializer.serialize(savedUser)).created();
};

const getCurrentUser = function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  return usecases.getCurrentUser({ authenticatedUserId }).then(userWithActivitySerializer.serialize);
};

const getUserDetailsForAdmin = async function (request) {
  const userId = request.params.id;
  const userDetailsForAdmin = await usecases.getUserDetailsForAdmin({ userId });
  return userDetailsForAdminSerializer.serialize(userDetailsForAdmin);
};

const updatePassword = async function (request) {
  const userId = request.params.id;
  const password = request.payload.data.attributes.password;

  const updatedUser = await usecases.updateUserPassword({
    userId,
    password,
    temporaryKey: request.query['temporary-key'] || '',
  });

  return userSerializer.serialize(updatedUser);
};

const updateUserDetailsForAdministration = async function (request) {
  const userId = request.params.id;
  const userDetailsForAdministration = userDetailsForAdminSerializer.deserialize(request.payload);

  const updatedUser = await usecases.updateUserDetailsForAdministration({
    userId,
    userDetailsForAdministration,
  });

  return userDetailsForAdminSerializer.serializeForUpdate(updatedUser);
};

const acceptPixLastTermsOfService = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.acceptPixLastTermsOfService({
    userId: authenticatedUserId,
  });

  return userSerializer.serialize(updatedUser);
};

const changeLang = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const lang = request.params.lang;
  const updatedUser = await usecases.changeUserLang({
    userId: authenticatedUserId,
    lang,
  });

  return userSerializer.serialize(updatedUser);
};

const acceptPixOrgaTermsOfService = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.acceptPixOrgaTermsOfService({
    userId: authenticatedUserId,
  });

  return userSerializer.serialize(updatedUser);
};

const acceptPixCertifTermsOfService = async function (request, h) {
  const authenticatedUserId = request.auth.credentials.userId;

  await usecases.acceptPixCertifTermsOfService({
    userId: authenticatedUserId,
  });

  return h.response().code(204);
};

const rememberUserHasSeenAssessmentInstructions = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.rememberUserHasSeenAssessmentInstructions({ userId: authenticatedUserId });
  return userSerializer.serialize(updatedUser);
};

const rememberUserHasSeenNewDashboardInfo = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.rememberUserHasSeenNewDashboardInfo({ userId: authenticatedUserId });
  return userSerializer.serialize(updatedUser);
};

const rememberUserHasSeenChallengeTooltip = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const challengeType = request.params.challengeType;

  const updatedUser = await usecases.rememberUserHasSeenChallengeTooltip({
    userId: authenticatedUserId,
    challengeType,
  });
  return userSerializer.serialize(updatedUser);
};

const findPaginatedFilteredUsers = async function (request) {
  const options = extractParameters(request.query);

  const { models: users, pagination } = await usecases.findPaginatedFilteredUsers({
    filter: options.filter,
    page: options.page,
  });
  return userForAdminSerializer.serialize(users, pagination);
};

const findPaginatedUserRecommendedTrainings = async function (request) {
  const locale = extractLocaleFromRequest(request);
  const { page } = extractParameters(request.query);
  const { userRecommendedTrainings, meta } = await usecases.findPaginatedUserRecommendedTrainings({
    userId: request.auth.credentials.userId,
    locale,
    page,
  });

  return trainingSerializer.serialize(userRecommendedTrainings, meta);
};

const getCampaignParticipations = function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  return usecases
    .findLatestOngoingUserCampaignParticipations({ userId: authenticatedUserId })
    .then(campaignParticipationSerializer.serialize);
};

const getCampaignParticipationOverviews = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const query = extractParameters(request.query);

  const userCampaignParticipationOverviews = await usecases.findUserCampaignParticipationOverviews({
    userId: authenticatedUserId,
    states: query.filter.states,
    page: query.page,
  });

  return campaignParticipationOverviewSerializer.serializeForPaginatedList(userCampaignParticipationOverviews);
};

const isCertifiable = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  const certificationEligibility = await usecases.getUserCertificationEligibility({ userId: authenticatedUserId });
  return certificationEligibilitySerializer.serialize(certificationEligibility);
};

const getProfile = function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const locale = extractLocaleFromRequest(request);

  return usecases.getUserProfile({ userId: authenticatedUserId, locale }).then(profileSerializer.serialize);
};

const getProfileForAdmin = function (request) {
  const userId = request.params.id;
  const locale = extractLocaleFromRequest(request);

  return usecases.getUserProfile({ userId, locale }).then(profileSerializer.serialize);
};

const resetScorecard = function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const competenceId = request.params.competenceId;
  const locale = extractLocaleFromRequest(request);

  return usecases
    .resetScorecard({ userId: authenticatedUserId, competenceId, locale })
    .then(scorecardSerializer.serialize);
};

const getUserCampaignParticipationToCampaign = function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const campaignId = request.params.campaignId;

  return usecases
    .getUserCampaignParticipationToCampaign({ userId: authenticatedUserId, campaignId })
    .then((campaignParticipation) => campaignParticipationSerializer.serialize(campaignParticipation));
};

const getUserProfileSharedForCampaign = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const campaignId = request.params.campaignId;
  const locale = extractLocaleFromRequest(request);

  const sharedProfileForCampaign = await usecases.getUserProfileSharedForCampaign({
    userId: authenticatedUserId,
    campaignId,
    locale,
  });

  return sharedProfileForCampaignSerializer.serialize(sharedProfileForCampaign);
};

const getUserCampaignAssessmentResult = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;
  const campaignId = request.params.campaignId;
  const locale = extractLocaleFromRequest(request);

  const campaignAssessmentResult = await usecases.getUserCampaignAssessmentResult({
    userId: authenticatedUserId,
    campaignId,
    locale,
  });

  return participantResultSerializer.serialize(campaignAssessmentResult);
};

const anonymizeUser = async function (request, h) {
  const userToAnonymizeId = request.params.id;
  const adminMemberId = request.auth.credentials.userId;
  const user = await usecases.anonymizeUser({ userId: userToAnonymizeId, updatedByUserId: adminMemberId });
  return h.response(userAnonymizedDetailsForAdminSerializer.serialize(user)).code(200);
};

const unblockUserAccount = async function (request, h) {
  const userId = request.params.id;
  const userLogin = await usecases.unblockUserAccount({ userId });
  return h.response(userLoginSerializer.serialize(userLogin)).code(200);
};

const removeAuthenticationMethod = async function (request, h) {
  const userId = request.params.id;
  const type = request.payload.data.attributes.type;
  await usecases.removeAuthenticationMethod({ userId, type });
  return h.response().code(204);
};

const sendVerificationCode = async function (request, h) {
  const locale = extractLocaleFromRequest(request);
  const i18n = request.i18n;
  const userId = request.params.id;
  const { newEmail, password } = await emailVerificationSerializer.deserialize(request.payload);

  await usecases.sendVerificationCode({ i18n, locale, newEmail, password, userId });
  return h.response().code(204);
};

const updateUserEmailWithValidation = async function (request) {
  const userId = request.params.id;
  const code = request.payload.data.attributes.code;

  const updatedUserAttributes = await usecases.updateUserEmailWithValidation({
    userId,
    code,
  });

  return updateEmailSerializer.serialize(updatedUserAttributes);
};

const getUserAuthenticationMethods = async function (request) {
  const userId = request.params.id;

  const authenticationMethods = await usecases.findUserAuthenticationMethods({ userId });

  return authenticationMethodsSerializer.serialize(authenticationMethods);
};

const addPixAuthenticationMethodByEmail = async function (request, h) {
  const userId = request.params.id;
  const email = request.payload.data.attributes.email.trim().toLowerCase();

  const userUpdated = await usecases.addPixAuthenticationMethodByEmail({
    userId,
    email,
  });
  return h.response(userDetailsForAdminSerializer.serialize(userUpdated)).created();
};

const reassignAuthenticationMethods = async function (request, h) {
  const authenticationMethodId = request.params.authenticationMethodId;
  const originUserId = request.params.userId;
  const targetUserId = request.payload.data.attributes['user-id'];

  await usecases.reassignAuthenticationMethodToAnotherUser({
    originUserId,
    targetUserId,
    authenticationMethodId,
  });
  return h.response().code(204);
};

const findCampaignParticipationsForUserManagement = async function (request, h) {
  const userId = request.params.id;
  const campaignParticipations = await usecases.findCampaignParticipationsForUserManagement({
    userId,
  });
  return h.response(campaignParticipationForUserManagementSerializer.serialize(campaignParticipations));
};

const findUserOrganizationsForAdmin = async function (request, h) {
  const userId = request.params.id;
  const organizations = await usecases.findUserOrganizationsForAdmin({
    userId,
  });
  return h.response(userOrganizationForAdminSerializer.serialize(organizations));
};

const findCertificationCenterMembershipsByUser = async function (request, h) {
  const userId = request.params.id;
  const certificationCenterMemberships = await usecases.findCertificationCenterMembershipsByUser({
    userId,
  });
  return h.response(certificationCenterMembershipSerializer.serializeForAdmin(certificationCenterMemberships));
};

const rememberUserHasSeenLastDataProtectionPolicyInformation = async function (request) {
  const authenticatedUserId = request.auth.credentials.userId;

  const updatedUser = await usecases.rememberUserHasSeenLastDataProtectionPolicyInformation({
    userId: authenticatedUserId,
  });
  return userSerializer.serialize(updatedUser);
};

export {
  save,
  getCurrentUser,
  getUserDetailsForAdmin,
  updatePassword,
  updateUserDetailsForAdministration,
  acceptPixLastTermsOfService,
  changeLang,
  acceptPixOrgaTermsOfService,
  acceptPixCertifTermsOfService,
  rememberUserHasSeenAssessmentInstructions,
  rememberUserHasSeenNewDashboardInfo,
  rememberUserHasSeenChallengeTooltip,
  findPaginatedFilteredUsers,
  findPaginatedUserRecommendedTrainings,
  getCampaignParticipations,
  getCampaignParticipationOverviews,
  isCertifiable,
  getProfile,
  getProfileForAdmin,
  resetScorecard,
  getUserCampaignParticipationToCampaign,
  getUserProfileSharedForCampaign,
  getUserCampaignAssessmentResult,
  anonymizeUser,
  unblockUserAccount,
  removeAuthenticationMethod,
  sendVerificationCode,
  updateUserEmailWithValidation,
  getUserAuthenticationMethods,
  addPixAuthenticationMethodByEmail,
  reassignAuthenticationMethods,
  findCampaignParticipationsForUserManagement,
  findUserOrganizationsForAdmin,
  findCertificationCenterMembershipsByUser,
  rememberUserHasSeenLastDataProtectionPolicyInformation,
};
