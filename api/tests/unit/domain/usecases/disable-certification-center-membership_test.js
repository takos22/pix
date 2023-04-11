import { expect, sinon } from '../../../test-helper.js';
import { disableCertificationCenterMembership } from '../../../../lib/domain/usecases/index.js';
import * as certificationCenterMembershipRepository from '../../../../lib/infrastructure/repositories/certification-center-membership-repository.js';

describe('Unit | UseCase | disable-certification-center-membership', function () {
  it('should disable certification center membership', async function () {
    // given
    const certificationCenterMembershipId = 100;
    sinon.stub(certificationCenterMembershipRepository, 'disableById');

    // when
    await disableCertificationCenterMembership({
      certificationCenterMembershipId,
      certificationCenterMembershipRepository,
    });

    // then
    expect(certificationCenterMembershipRepository.disableById).to.have.been.calledWithExactly({
      certificationCenterMembershipId,
    });
  });
});
