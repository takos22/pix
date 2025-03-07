import { expect, sinon, catchErr, domainBuilder } from '../../../test-helper.js';
import { sendScoInvitation } from '../../../../lib/domain/usecases/send-sco-invitation.js';

import {
  OrganizationNotFoundError,
  OrganizationWithoutEmailError,
  ManyOrganizationsFoundError,
  OrganizationArchivedError,
} from '../../../../lib/domain/errors.js';

describe('Unit | UseCase | send-sco-invitation', function () {
  let organizationRepository, organizationInvitationRepository, organizationInvitationService;

  beforeEach(function () {
    organizationRepository = {
      findScoOrganizationsByUai: sinon.stub(),
    };
    organizationInvitationService = {
      createScoOrganizationInvitation: sinon.stub(),
    };
  });

  it('should call createScoOrganizationInvitation service', async function () {
    // given
    const firstName = 'Guy';
    const lastName = 'Tar';
    const locale = 'fr-fr';
    const uai = '1234567A';
    const organization = domainBuilder.buildOrganization({
      type: 'SCO',
      externalId: uai,
      archivedAt: null,
      email: 'sco.orga@example.net',
    });

    organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([organization]);

    await sendScoInvitation({
      firstName,
      lastName,
      locale,
      uai,
      organizationRepository,
      organizationInvitationRepository,
      organizationInvitationService,
    });

    expect(organizationInvitationService.createScoOrganizationInvitation).to.have.been.calledOnceWithExactly({
      organizationId: organization.id,
      firstName,
      lastName,
      email: organization.email,
      locale,
      organizationRepository,
      organizationInvitationRepository,
    });
  });

  context('Error cases', function () {
    context('when uai did not match', function () {
      it('should throw an NotFoundOrganizationError', async function () {
        // given
        const uai = '1234567A';
        domainBuilder.buildOrganization({ type: 'SCO', externalId: uai });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([]);

        const requestErr = await catchErr(sendScoInvitation)({
          uai,
          organizationRepository,
        });

        expect(requestErr).to.be.instanceOf(OrganizationNotFoundError);
        expect(requestErr.message).to.be.equal("L'UAI/RNE 1234567A de l'établissement n’est pas reconnu.");
      });
    });

    context('when email is not present', function () {
      it('should throw an OrganizationWithoutEmailError', async function () {
        // given
        const uai = '1234567A';
        const organization = domainBuilder.buildOrganization({ type: 'SCO', externalId: uai, email: null });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([organization]);

        const requestErr = await catchErr(sendScoInvitation)({
          uai,
          organizationRepository,
        });

        expect(requestErr).to.be.instanceOf(OrganizationWithoutEmailError);
        expect(requestErr.message).to.be.equal(
          "Nous n’avons pas d’adresse e-mail de contact associée à l'établissement concernant l'UAI/RNE 1234567A.",
        );
      });
    });

    context('when many organizations found', function () {
      it('should throw a ManyOrganizationsFoundError', async function () {
        // given
        const uai = '1234567A';
        const organization1 = domainBuilder.buildOrganization({ type: 'SCO', externalId: uai });
        const organization2 = domainBuilder.buildOrganization({ type: 'SCO', externalId: uai });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([organization1, organization2]);

        // when
        const requestErr = await catchErr(sendScoInvitation)({
          uai,
          organizationRepository,
        });

        // then
        expect(requestErr).to.be.instanceOf(ManyOrganizationsFoundError);
        expect(requestErr.message).to.be.equal(
          "Plusieurs établissements de type SCO ont été retrouvés pour L'UAI/RNE 1234567A.",
        );
      });
    });

    context('when organization is archived', function () {
      it('should throw a OrganizationArchivedError', async function () {
        // given
        const uai = '1234567A';
        const archivedOrganization = domainBuilder.buildOrganization({
          type: 'SCO',
          externalId: uai,
          archivedAt: '2022-02-02',
        });

        organizationRepository.findScoOrganizationsByUai.withArgs({ uai }).resolves([archivedOrganization]);

        // when
        const requestErr = await catchErr(sendScoInvitation)({
          uai,
          organizationRepository,
        });

        // then
        expect(requestErr).to.be.instanceOf(OrganizationArchivedError);
      });
    });
  });
});
