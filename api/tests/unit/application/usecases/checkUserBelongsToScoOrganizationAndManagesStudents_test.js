import { expect, sinon, domainBuilder } from '../../../test-helper.js';
import { useCase } from '../../../../lib/application/usecases/checkUserBelongsToScoOrganizationAndManagesStudents.js';
import * as membershipRepository from '../../../../lib/infrastructure/repositories/membership-repository.js';

describe('Unit | Application | Use Case | checkUserBelongsToScoOrganizationAndManagesStudents', function () {
  beforeEach(function () {
    membershipRepository.findByUserIdAndOrganizationId = sinon.stub();
  });

  context('When user is in a SCO organization', function () {
    it('should return true', async function () {
      // given
      const userId = 1234;

      const organization = domainBuilder.buildOrganization({ type: 'SCO', isManagingStudents: true });
      const membership = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(true);
    });

    it('should return true when there are several memberships', async function () {
      // given
      const userId = 1234;

      const organization = domainBuilder.buildOrganization({ type: 'SCO', isManagingStudents: true });
      const membership1 = domainBuilder.buildMembership({ organization });
      const membership2 = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership1, membership2]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(true);
    });
  });

  context('When user is not in a SCO organization', function () {
    it('should return false', async function () {
      // given
      const userId = 1234;
      const organization = domainBuilder.buildOrganization({ type: 'PRO', isManagingStudents: true });
      const membership = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(false);
    });
  });

  context('When user is in a SCO organization but does not manage students', function () {
    it('should return false', async function () {
      // given
      const userId = 1234;
      const organization = domainBuilder.buildOrganization({ type: 'SCO', isManagingStudents: false });
      const membership = domainBuilder.buildMembership({ organization });
      membershipRepository.findByUserIdAndOrganizationId.resolves([membership]);

      // when
      const response = await useCase.execute(userId, organization.id);

      // then
      expect(response).to.equal(false);
    });
  });
});
