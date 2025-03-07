import BaseJoi from 'joi';
import JoiDate from '@joi/date';
const Joi = BaseJoi.extend(JoiDate);

import { sendJsonApiError, UnprocessableEntityError, NotFoundError } from '../http-errors.js';
import { supOrganizationLearnerController } from './sup-organization-learner-controller.js';
import { securityPreHandlers } from '../security-pre-handlers.js';
import { identifiersType } from '../../domain/types/identifiers-type.js';

const register = async function (server) {
  server.route([
    {
      method: 'POST',
      path: '/api/sup-organization-learners/association',
      config: {
        handler: supOrganizationLearnerController.reconcileSupOrganizationLearner,
        validate: {
          options: {
            allowUnknown: false,
          },
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'first-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                'last-name': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
                birthdate: Joi.date().format('YYYY-MM-DD').required(),
                'campaign-code': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
              type: 'sup-organization-learners',
            },
          }),
          failAction: (request, h) => {
            return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
          },
        },
        notes: [
          '- **Cette route est restreinte aux utilisateurs authentifiés**\n' +
            '- Elle réconcilie l’utilisateur à l’inscription d’un étudiant dans cette organisation',
        ],
        tags: ['api', 'sup-organization-learner'],
      },
    },
    {
      method: 'PATCH',
      path: '/api/organizations/{id}/sup-organization-learners/{organizationLearnerId}',
      config: {
        pre: [
          {
            method: securityPreHandlers.checkUserIsAdminInSUPOrganizationManagingStudents,
          },
        ],
        handler: supOrganizationLearnerController.updateStudentNumber,
        validate: {
          options: {
            allowUnknown: true,
          },
          params: Joi.object({
            id: identifiersType.organizationId,
            organizationLearnerId: identifiersType.organizationLearnerId,
          }),
          payload: Joi.object({
            data: {
              attributes: {
                'student-number': Joi.string().empty(Joi.string().regex(/^\s*$/)).required(),
              },
            },
          }),
          failAction: (request, h, err) => {
            const isStudentNumber = err.details[0].path.includes('student-number');
            if (isStudentNumber) {
              return sendJsonApiError(new UnprocessableEntityError('Un des champs saisis n’est pas valide.'), h);
            }
            return sendJsonApiError(new NotFoundError('Ressource non trouvée'), h);
          },
        },
        notes: [
          "- **Cette route est restreinte aux utilisateurs authentifiés et admin au sein de l'orga**\n" +
            '- Elle met à jour le numéro étudiant',
        ],
        tags: ['api', 'sup-organization-learners'],
      },
    },
  ]);
};

const name = 'sup-organization-learners-api';
export { register, name };
