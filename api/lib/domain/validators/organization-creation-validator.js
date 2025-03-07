import Joi from 'joi';
import { EntityValidationError } from '../../../src/shared/domain/errors.js';

const validationConfiguration = { abortEarly: false, allowUnknown: true };

const organizationValidationJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Le nom n’est pas renseigné.',
  }),

  type: Joi.string().required().valid('SCO', 'SUP', 'PRO', 'SCO-1D').messages({
    'string.empty': 'Le type n’est pas renseigné.',
    'any.only': 'Le type de l’organisation doit avoir l’une des valeurs suivantes: SCO, SUP, PRO.',
  }),

  documentationUrl: Joi.string().uri().allow(null).messages({
    'string.uri': 'Le lien vers la documentation n’est pas valide.',
  }),
});

const validate = function (organizationCreationParams) {
  const { error } = organizationValidationJoiSchema.validate(organizationCreationParams, validationConfiguration);
  if (error) {
    throw EntityValidationError.fromJoiErrors(error.details);
  }
  return true;
};

export { validate };
