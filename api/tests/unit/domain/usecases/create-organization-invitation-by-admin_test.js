import { expect, sinon, catchErr, domainBuilder } from '../../../test-helper.js';
import { Membership } from '../../../../lib/domain/models/Membership.js';
import { createOrganizationInvitationByAdmin } from '../../../../lib/domain/usecases/create-organization-invitation-by-admin.js';
import { OrganizationArchivedError } from '../../../../lib/domain/errors.js';

describe('Unit | UseCase | create-organization-invitation-by-admin', function () {
  describe('#createOrganizationInvitationByAdmin', function () {
    it('should create one organization-invitation with organizationId, role and email', async function () {
      // given
      const organization = domainBuilder.buildOrganization();
      const email = 'member@organization.org';
      const locale = 'fr-fr';
      const role = Membership.roles.MEMBER;

      const organizationInvitationRepository = sinon.stub();
      const organizationRepository = { get: sinon.stub().resolves(organization) };
      const organizationInvitationService = { createOrUpdateOrganizationInvitation: sinon.stub() };

      // when
      await createOrganizationInvitationByAdmin({
        organizationId: organization.id,
        email,
        locale,
        role,
        organizationRepository,
        organizationInvitationRepository,
        organizationInvitationService,
      });

      // then
      expect(organizationInvitationService.createOrUpdateOrganizationInvitation).to.has.been.calledOnce;
      expect(organizationInvitationService.createOrUpdateOrganizationInvitation).to.has.been.calledWithExactly({
        organizationId: organization.id,
        email,
        locale,
        role,
        organizationRepository,
        organizationInvitationRepository,
      });
    });

    it('should throw an organization archived error when it is archived', async function () {
      // given
      const archivedOrganization = domainBuilder.buildOrganization({ archivedAt: '2022-02-02' });
      const emails = ['member01@organization.org'];
      const locale = 'fr-fr';
      const role = Membership.roles.MEMBER;

      const organizationInvitationRepository = sinon.stub();
      const organizationRepository = {
        get: sinon.stub().resolves(archivedOrganization),
      };
      const organizationInvitationService = { createOrUpdateOrganizationInvitation: sinon.stub() };

      // when
      const error = await catchErr(createOrganizationInvitationByAdmin)({
        organizationId: archivedOrganization.id,
        emails,
        locale,
        role,
        organizationRepository,
        organizationInvitationRepository,
        organizationInvitationService,
      });

      // then
      expect(error).to.be.instanceOf(OrganizationArchivedError);
      expect(error.message).to.be.equal("L'organisation est archivée.");
      expect(organizationInvitationService.createOrUpdateOrganizationInvitation).to.not.have.been.called;
    });
  });
});
