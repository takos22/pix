import { Bookshelf } from '../bookshelf.js';
import * as bookshelfToDomainConverter from '../utils/bookshelf-to-domain-converter.js';
import { DomainTransaction } from '../DomainTransaction.js';
import { CertificationChallengeBookshelf } from '../orm-models/CertificationChallenge.js';
import { logger } from '../../infrastructure/logger.js';
import { AssessmentEndedError } from '../../domain/errors.js';

const logContext = {
  zone: 'certificationChallengeRepository.getNextNonAnsweredChallengeByCourseId',
  type: 'repository',
};

const save = async function ({ certificationChallenge, domainTransaction = DomainTransaction.emptyTransaction() }) {
  const certificationChallengeToSave = new CertificationChallengeBookshelf({
    challengeId: certificationChallenge.challengeId,
    competenceId: certificationChallenge.competenceId,
    associatedSkillName: certificationChallenge.associatedSkillName,
    associatedSkillId: certificationChallenge.associatedSkillId,
    courseId: certificationChallenge.courseId,
    certifiableBadgeKey: certificationChallenge.certifiableBadgeKey,
  });
  const savedCertificationChallenge = await certificationChallengeToSave.save(null, {
    transacting: domainTransaction.knexTransaction,
  });
  return bookshelfToDomainConverter.buildDomainObject(CertificationChallengeBookshelf, savedCertificationChallenge);
};

const getNextNonAnsweredChallengeByCourseId = async function (assessmentId, courseId) {
  const answeredChallengeIds = Bookshelf.knex('answers').select('challengeId').where({ assessmentId });

  const certificationChallenge = await CertificationChallengeBookshelf.where({ courseId })
    .query((knex) => knex.whereNotIn('challengeId', answeredChallengeIds))
    .orderBy('id', 'asc')
    .fetch({ require: false });

  if (certificationChallenge === null) {
    logger.trace(logContext, 'no found challenges');
    throw new AssessmentEndedError();
  }

  logContext.challengeId = certificationChallenge.id;
  logger.trace(logContext, 'found challenge');
  return bookshelfToDomainConverter.buildDomainObject(CertificationChallengeBookshelf, certificationChallenge);
};

export { save, getNextNonAnsweredChallengeByCourseId };
