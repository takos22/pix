const Joi = require('joi').extend(require('@joi/date'));

const securityPreHandlers = require('../security-pre-handlers');
const organizationLearnerController = require('./organization-learner-controller');
const identifiersType = require('../../domain/types/identifiers-type');

exports.register = async function (server) {
  const adminRoutes = [
    {
      method: 'DELETE',
      path: '/api/admin/organization-learners/{id}/association',
      config: {
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleSupport,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: organizationLearnerController.dissociate,
        validate: {
          params: Joi.object({
            id: identifiersType.organizationLearnerId,
          }),
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle dissocie un utilisateur d’un prescrit',
        ],
        tags: ['api', 'admin', 'organization-learners'],
      },
    },
  ];

  server.route([
    ...adminRoutes,
    {
      method: 'GET',
      path: '/api/organization-learners',
      config: {
        handler: organizationLearnerController.findAssociation,
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Récupération du prescrit\n' +
            '- L’id demandé doit correspondre à celui de l’utilisateur authentifié',
        ],
        tags: ['api', 'organization-learners'],
      },
    },
    {
      method: 'GET',
      path: '/api/organizations/{id}/organization-learners/{learnerId}',
      config: {
        pre: [{ method: securityPreHandlers.checkUserBelongsToOrganization }],
        handler: organizationLearnerController.get,
        notes: [
          "- **Cette route est restreinte aux membres de l'organisation**\n" +
            '- Récupération des informations du prescrit\n' +
            "- Le prescrit doit appartenir à l'organisation.",
        ],
        tags: ['api', 'organization-learners'],
      },
    },
  ]);
};

exports.name = 'organization-learners-api';
