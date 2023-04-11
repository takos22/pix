import { sessionValidator } from '../validators/session-validator.js';

const updateSession = async function ({ session, sessionRepository }) {
  sessionValidator.validate(session);
  const sessionToUpdate = await sessionRepository.get(session.id);
  Object.assign(sessionToUpdate, session);

  return sessionRepository.updateSessionInfo(sessionToUpdate);
};

export { updateSession };
