import { expect, sinon, domainBuilder } from '../../../test-helper.js';
import * as usecase from '../../../../lib/application/usecases/checkUserBelongsToLearnersOrganization.js';
import * as membershipRepository from '../../../../lib/infrastructure/repositories/membership-repository.js';
import * as organizationLearnerRepository from '../../../../lib/infrastructure/repositories/organization-learner-repository.js';

describe('Unit | Application | Use Case | checkUserBelongsToLearnersOrganization', function () {
  beforeEach(function () {
    sinon.stub(membershipRepository, 'findByUserIdAndOrganizationId');
    sinon.stub(organizationLearnerRepository, 'get');
  });

  it('should return true when user belongs to the same organization as learner', async function () {
    // given
    const userId = 1234;
    const organizationLearnerId = 5678;

    const sharedOrganization = domainBuilder.buildOrganization();

    const membership = domainBuilder.buildMembership({ organization: sharedOrganization });
    const organizationLearner = domainBuilder.buildOrganizationLearner({
      id: organizationLearnerId,
      organization: sharedOrganization,
    });
    organizationLearnerRepository.get.resolves(organizationLearner);
    membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

    // when
    const response = await usecase.execute(userId, organizationLearnerId);

    // then
    expect(response).to.equal(true);
    expect(membershipRepository.findByUserIdAndOrganizationId).to.have.been.calledWith({
      userId,
      organizationId: sharedOrganization.id,
    });
  });

  it("should return false when user is not a member of the learner's organization", async function () {
    // given
    const userId = 1234;
    const organizationLearnerId = 5678;

    const anotherOrganization = domainBuilder.buildOrganization();

    const organizationLearner = domainBuilder.buildOrganizationLearner({
      id: organizationLearnerId,
      anotherOrganization,
    });
    organizationLearnerRepository.get.resolves(organizationLearner);
    membershipRepository.findByUserIdAndOrganizationId.resolves([]);

    // when
    const response = await usecase.execute(userId, organizationLearnerId);

    // then
    expect(response).to.equal(false);
    expect(membershipRepository.findByUserIdAndOrganizationId).to.have.been.calledWith({
      userId,
      organizationId: anotherOrganization.id,
    });
  });
});
