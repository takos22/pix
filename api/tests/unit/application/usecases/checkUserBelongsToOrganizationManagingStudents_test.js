import { expect, sinon, domainBuilder } from '../../../test-helper.js';
import { usecase } from '../../../../lib/application/usecases/checkUserBelongsToOrganizationManagingStudents.js';
import * as membershipRepository from '../../../../lib/infrastructure/repositories/membership-repository.js';

describe('Unit | Application | Use Case | checkUserBelongsToOrganizationManagingStudents', function () {
  beforeEach(function () {
    sinon.stub(membershipRepository, 'findByUserIdAndOrganizationId');
  });

  it('should return true when user belongs to organization managing students', async function () {
    // given
    const userId = 1234;

    const organization = domainBuilder.buildOrganization({ isManagingStudents: true });
    const membership = domainBuilder.buildMembership({ organization });
    membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

    // when
    const response = await usecase.execute(userId, organization.id);

    // then
    expect(response).to.equal(true);
  });

  it('should return false when organization does not manage students', async function () {
    // given
    const userId = 1234;

    const organization = domainBuilder.buildOrganization({ isManagingStudents: false });
    const membership = domainBuilder.buildMembership({ organization });
    membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

    // when
    const response = await usecase.execute(userId, organization.id);

    // then
    expect(response).to.equal(false);
  });

  it('should return false when user is not a member of organization', async function () {
    // given
    const userId = 1234;

    const organization = domainBuilder.buildOrganization({ isManagingStudents: true });
    membershipRepository.findByUserIdAndOrganizationId.resolves([]);

    // when
    const response = await usecase.execute(userId, organization.id);

    // then
    expect(response).to.equal(false);
  });
});
