import { CertificationCandidateForbiddenDeletionError } from '../errors.js';

const deleteUnlinkedCertificationCandidate = async function ({
  certificationCandidateId,
  certificationCandidateRepository,
}) {
  const isNotLinked = await certificationCandidateRepository.isNotLinked(certificationCandidateId);

  if (isNotLinked) {
    return certificationCandidateRepository.remove(certificationCandidateId);
  }

  throw new CertificationCandidateForbiddenDeletionError();
};

export { deleteUnlinkedCertificationCandidate };
