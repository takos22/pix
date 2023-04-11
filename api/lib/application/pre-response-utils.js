import { errorManager } from './error-manager.js';
import { BaseHttpError } from './http-errors.js';
import { DomainError } from '../domain/errors.js';

function handleDomainAndHttpErrors(request, h) {
  const response = request.response;

  if (response instanceof DomainError || response instanceof BaseHttpError) {
    return errorManager.handle(request, h, response);
  }

  return h.continue;
}

export { handleDomainAndHttpErrors };
