import Joi from 'joi';

import { challengeController } from './challenge-controller.js';
import { identifiersType } from '../../domain/types/identifiers-type.js';
import { securityPreHandlers } from '../security-pre-handlers.js';

const register = async function (server) {
  server.route([
    {
      method: 'GET',
      path: '/api/challenges/{id}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.challengeId,
          }),
        },
        handler: challengeController.get,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/pix1d/challenges/{id}',
      config: {
        pre: [{ method: securityPreHandlers.checkPix1dActivated }],
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.challengeId,
          }),
        },
        handler: challengeController.get,
        tags: ['api'],
      },
    },
    {
      method: 'POST',
      path: '/api/challenge-previews',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkAdminMemberHasRoleSuperAdmin,
            assign: 'hasRoleSuperAdmin',
          },
        ],
        handler: challengeController.createPreview,
        tags: ['api', 'challenge', 'preview'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés avec le rôle Super Admin',
          'Elle permet de créer une preview de challenge',
        ],
      },
    },
    {
      method: 'GET',
      path: '/api/challenge-previews/{id}',
      config: {
        auth: false,
        validate: {
          params: Joi.object({
            id: identifiersType.challengePreviewId,
          }),
        },
        handler: challengeController.getPreview,
        tags: ['api', 'challenge', 'preview'],
        notes: [
          'Cette route est restreinte aux utilisateurs authentifiés avec le rôle Super Admin',
          'Elle permet de créer une preview de challenge',
        ],
      },
    },
  ]);
};

const name = 'challenges-api';
export { register, name };
