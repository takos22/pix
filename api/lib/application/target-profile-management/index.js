import * as securityPreHandlers from '../security-pre-handlers.js';
import * as stagesController from './stages-controller.js';
import Joi from 'joi';
import { identifiersType } from '../../domain/types/identifiers-type.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/admin/stages',
      config: {
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: stagesController.create,
        tags: ['api', 'admin', 'stages'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/admin/stages/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.stageId,
          }),
        },
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: stagesController.update,
        tags: ['api', 'admin', 'stages'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle permet de modifier un palier.',
        ],
      },
    },
    {
      method: 'DELETE',
      path: '/api/admin/stages/{id}',
      config: {
        validate: {
          params: Joi.object({
            id: identifiersType.stageId,
          }),
        },
        pre: [
          {
            method: (request, h) =>
              securityPreHandlers.adminMemberHasAtLeastOneAccessOf([
                securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
                securityPreHandlers.checkAdminMemberHasRoleMetier,
              ])(request, h),
            assign: 'hasAuthorizationToAccessAdminScope',
          },
        ],
        handler: stagesController.remove,
        tags: ['api', 'admin', 'stages'],
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés ayant les droits d'accès**\n" +
            '- Elle permet de supprimer un palier.',
        ],
      },
    },
  ]);
};

const name = 'stages-api';
export { register, name };
