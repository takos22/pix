import _ from 'lodash';

import { MissingQueryParamError } from '../http-errors.js';
import { usecases } from '../../domain/usecases/index.js';
import * as organizationInvitationSerializer from '../../infrastructure/serializers/jsonapi/organization-invitation-serializer.js';
import * as scoOrganizationInvitationSerializer from '../../infrastructure/serializers/jsonapi/sco-organization-invitation-serializer.js';
import { extractLocaleFromRequest } from '../../infrastructure/utils/request-response-utils.js';

const acceptOrganizationInvitation = async function (request) {
  const organizationInvitationId = request.params.id;
  const { code, email: rawEmail } = request.payload.data.attributes;
  const email = rawEmail?.trim().toLowerCase();

  const membership = await usecases.acceptOrganizationInvitation({ organizationInvitationId, code, email });
  await usecases.createCertificationCenterMembershipForScoOrganizationMember({ membership });
  return null;
};

const sendScoInvitation = async function (request, h) {
  const { uai, 'first-name': firstName, 'last-name': lastName } = request.payload.data.attributes;

  const locale = extractLocaleFromRequest(request);

  const organizationScoInvitation = await usecases.sendScoInvitation({ uai, firstName, lastName, locale });

  return h.response(scoOrganizationInvitationSerializer.serialize(organizationScoInvitation)).created();
};

const getOrganizationInvitation = async function (request) {
  const organizationInvitationId = request.params.id;
  const organizationInvitationCode = request.query.code;

  if (_.isEmpty(organizationInvitationCode)) {
    throw new MissingQueryParamError('code');
  }

  const organizationInvitation = await usecases.getOrganizationInvitation({
    organizationInvitationId,
    organizationInvitationCode,
  });
  return organizationInvitationSerializer.serialize(organizationInvitation);
};

export { acceptOrganizationInvitation, sendScoInvitation, getOrganizationInvitation };
