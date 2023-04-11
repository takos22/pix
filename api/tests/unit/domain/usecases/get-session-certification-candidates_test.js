import { expect, sinon } from '../../../test-helper.js';
import * as certificationCandidateRepository from '../../../../lib/infrastructure/repositories/certification-candidate-repository.js';
import { getSessionCertificationCandidates } from '../../../../lib/domain/usecases/get-session-certification-candidates.js';

describe('Unit | Domain | Use Cases | get-session-certification-candidates', function () {
  const sessionId = 'sessionId';
  const certificationCandidates = 'candidates';

  beforeEach(function () {
    // given
    sinon
      .stub(certificationCandidateRepository, 'findBySessionId')
      .withArgs(sessionId)
      .resolves(certificationCandidates);
  });

  it('should return the certification candidates', async function () {
    // when
    const actualCandidates = await getSessionCertificationCandidates({ sessionId, certificationCandidateRepository });

    // then
    expect(actualCandidates).to.equal(certificationCandidates);
  });
});
