import { saml } from '../../infrastructure/saml.js';
import { usecases } from '../../domain/usecases/index.js';
import { logger } from '../../infrastructure/logger.js';
import { tokenService } from '../../domain/services/token-service.js';
import { settings } from '../../config.js';

const metadata = function (request, h) {
  return h.response(saml.getServiceProviderMetadata()).type('application/xml');
};

const login = function (request, h) {
  return h.redirect(saml.createLoginRequest());
};

const assert = async function (request, h) {
  let userAttributes;
  try {
    userAttributes = await saml.parsePostResponse(request.payload);
  } catch (e) {
    logger.error({ e }, 'SAML: Error while parsing post response');
    return h.response(e.toString()).code(400);
  }

  try {
    const redirectionUrl = await usecases.getExternalAuthenticationRedirectionUrl({
      userAttributes,
      tokenService,
      settings,
    });

    return h.redirect(redirectionUrl);
  } catch (e) {
    logger.error({ e }, 'SAML: Error while get external authentication redirection url');
    return h.response(e.toString()).code(500);
  }
};

export { metadata, login, assert };
