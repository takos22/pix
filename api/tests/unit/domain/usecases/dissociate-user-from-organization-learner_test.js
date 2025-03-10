import { expect, sinon, domainBuilder, catchErr } from '../../../test-helper.js';
import { usecases } from '../../../../lib/domain/usecases/index.js';
import { OrganizationLearnerCannotBeDissociatedError } from '../../../../lib/domain/errors.js';

describe('Unit | UseCase | dissociate-user-from-organization-learner', function () {
  const organizationId = 1;
  const organizationLearnerId = 2;

  let organizationLearnerRepositoryStub;

  beforeEach(function () {
    domainBuilder.buildOrganizationLearner({
      organization: { id: organizationId },
      id: organizationLearnerId,
    });

    organizationLearnerRepositoryStub = {
      dissociateUserFromOrganizationLearner: sinon.stub(),
      getOrganizationLearnerForAdmin: sinon.stub(),
    };
  });

  it('should dissociate user from the organization learner', async function () {
    // given
    organizationLearnerRepositoryStub.getOrganizationLearnerForAdmin.resolves({ canBeDissociated: true });

    // when
    await usecases.dissociateUserFromOrganizationLearner({
      organizationLearnerId,
      organizationLearnerRepository: organizationLearnerRepositoryStub,
    });

    // then
    expect(organizationLearnerRepositoryStub.dissociateUserFromOrganizationLearner).to.be.have.been.calledWithExactly(
      organizationLearnerId,
    );
  });

  it('should throw an error when organization learner cannot be dissociated', async function () {
    // given
    organizationLearnerRepositoryStub.getOrganizationLearnerForAdmin.resolves({ canBeDissociated: false });

    // when
    const error = await catchErr(usecases.dissociateUserFromOrganizationLearner)({
      organizationLearnerId,
      organizationLearnerRepository: organizationLearnerRepositoryStub,
    });

    // then
    expect(error).to.be.instanceOf(OrganizationLearnerCannotBeDissociatedError);
  });
});
