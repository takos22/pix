import { domainBuilder, expect, sinon } from '../../../test-helper.js';
import { getUserCertificationEligibility } from '../../../../lib/domain/usecases/get-user-certification-eligibility.js';

describe('Unit | UseCase | get-user-certification-eligibility', function () {
  let clock;
  const now = new Date(2020, 1, 1);

  const placementProfileService = {
    getPlacementProfile: () => undefined,
  };
  const certificationBadgesService = {
    findLatestBadgeAcquisitions: () => undefined,
  };
  const complementaryCertificationCourseRepository = {
    getByUserId: () => undefined,
  };

  beforeEach(function () {
    clock = sinon.useFakeTimers(now);
    placementProfileService.getPlacementProfile = sinon.stub();
    certificationBadgesService.findLatestBadgeAcquisitions = sinon.stub();
    complementaryCertificationCourseRepository.getByUserId = sinon.stub();
  });

  afterEach(function () {
    clock.restore();
  });

  context('when pix certification is not eligible', function () {
    it('should return the user certification eligibility without eligible complementary certifications', async function () {
      // given
      const placementProfile = { isCertifiable: () => false };
      placementProfileService.getPlacementProfile.withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
      certificationBadgesService.findLatestBadgeAcquisitions.throws(new Error('I should not be called'));

      // when
      const certificationEligibility = await getUserCertificationEligibility({
        userId: 2,
        placementProfileService,
        certificationBadgesService,
      });

      // then
      const expectedCertificationEligibility = domainBuilder.buildCertificationEligibility({
        id: 2,
        pixCertificationEligible: false,
      });
      expect(certificationEligibility).to.deep.equal(expectedCertificationEligibility);
    });
  });

  context(`when badge is not acquired`, function () {
    it('should return the user certification eligibility without eligible badge', async function () {
      // given
      const placementProfile = { isCertifiable: () => true };
      placementProfileService.getPlacementProfile.withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
      certificationBadgesService.findLatestBadgeAcquisitions.resolves([]);
      complementaryCertificationCourseRepository.getByUserId.resolves([]);

      // when
      const certificationEligibility = await getUserCertificationEligibility({
        userId: 2,
        placementProfileService,
        certificationBadgesService,
        complementaryCertificationCourseRepository,
      });

      // then
      expect(certificationEligibility.complementaryCertifications).to.be.empty;
    });
  });

  context('when badge is acquired', function () {
    context('when the certification is not acquired', function () {
      it('should return the user certification eligibility with the acquired badge informations', async function () {
        // given
        const placementProfile = { isCertifiable: () => true };
        placementProfileService.getPlacementProfile.withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
        const badgeAcquisition = getOutdatedBadgeAcquisition();
        certificationBadgesService.findLatestBadgeAcquisitions.resolves([badgeAcquisition]);

        complementaryCertificationCourseRepository.getByUserId.resolves([
          domainBuilder.buildComplementaryCertificationCourseWithResults({
            id: 1,
            hasExternalJury: false,
            complementaryCertificationBadgeId: 2,
            results: [
              {
                id: 3,
                acquired: false,
                partnerKey: 'BADGE_KEY',
                source: 'PIX',
              },
            ],
          }),
        ]);

        // when
        const certificationEligibility = await getUserCertificationEligibility({
          userId: 2,
          placementProfileService,
          certificationBadgesService,
          complementaryCertificationCourseRepository,
        });

        // then
        expect(certificationEligibility.complementaryCertifications).to.deep.equal([
          {
            complementaryCertificationBadgeId: 2,
            label: 'BADGE_LABEL',
            imageUrl: 'http://www.image-url.com',
            isOutdated: true,
          },
        ]);
      });
    });
    context('when the certification is acquired', function () {
      it('should return the user certification eligibility with no acquired badge', async function () {
        // given
        const placementProfile = { isCertifiable: () => true };
        placementProfileService.getPlacementProfile.withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
        const badgeAcquisition = getOutdatedBadgeAcquisition();
        certificationBadgesService.findLatestBadgeAcquisitions.resolves([badgeAcquisition]);
        complementaryCertificationCourseRepository.getByUserId.resolves([
          domainBuilder.buildComplementaryCertificationCourseWithResults({
            id: 1,
            hasExternalJury: false,
            complementaryCertificationBadgeId: 2,
            results: [
              {
                id: 3,
                acquired: true,
                partnerKey: 'BADGE_KEY',
                source: 'PIX',
              },
            ],
          }),
        ]);

        // when
        const certificationEligibility = await getUserCertificationEligibility({
          userId: 2,
          placementProfileService,
          certificationBadgesService,
          complementaryCertificationCourseRepository,
        });

        // then
        expect(certificationEligibility.complementaryCertifications).to.be.empty;
      });
    });
    context('when the certification has no result', function () {
      it('should return the user certification eligibility with the acquired badge informations', async function () {
        // given
        const placementProfile = { isCertifiable: () => true };
        placementProfileService.getPlacementProfile.withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
        const badgeAcquisition = getOutdatedBadgeAcquisition();
        certificationBadgesService.findLatestBadgeAcquisitions.resolves([badgeAcquisition]);
        complementaryCertificationCourseRepository.getByUserId.resolves([
          domainBuilder.buildComplementaryCertificationCourseWithResults({
            id: 1,
            hasExternalJury: false,
            complementaryCertificationBadgeId: 2,
            results: [],
          }),
        ]);

        // when
        const certificationEligibility = await getUserCertificationEligibility({
          userId: 2,
          placementProfileService,
          certificationBadgesService,
          complementaryCertificationCourseRepository,
        });

        // then
        expect(certificationEligibility.complementaryCertifications).to.deep.equal([
          {
            complementaryCertificationBadgeId: 2,
            label: 'BADGE_LABEL',
            imageUrl: 'http://www.image-url.com',
            isOutdated: true,
          },
        ]);
      });
    });
    context('when the certification with external jury is acquired', function () {
      it('should return the user certification eligibility with no acquired badge', async function () {
        // given
        const placementProfile = { isCertifiable: () => true };
        placementProfileService.getPlacementProfile.withArgs({ userId: 2, limitDate: now }).resolves(placementProfile);
        const badgeAcquisition = getOutdatedBadgeAcquisition();
        certificationBadgesService.findLatestBadgeAcquisitions.resolves([badgeAcquisition]);
        complementaryCertificationCourseRepository.getByUserId.resolves([
          domainBuilder.buildComplementaryCertificationCourseWithResults({
            id: 1,
            hasExternalJury: true,
            complementaryCertificationBadgeId: 2,
            results: [
              {
                id: 3,
                acquired: true,
                partnerKey: 'BADGE_KEY',
                source: 'PIX',
              },
              {
                id: 4,
                acquired: true,
                partnerKey: 'BADGE_KEY',
                source: 'EXTERNAL',
              },
            ],
          }),
        ]);

        // when
        const certificationEligibility = await getUserCertificationEligibility({
          userId: 2,
          placementProfileService,
          certificationBadgesService,
          complementaryCertificationCourseRepository,
        });

        // then
        expect(certificationEligibility.complementaryCertifications).to.be.empty;
      });
    });
    context('when the certification with external jury is not acquired', function () {
      context('when the user failed the external examination', function () {
        it('should return the user certification eligibility with the acquired badge', async function () {
          // given
          const placementProfile = {
            isCertifiable: () => true,
          };
          placementProfileService.getPlacementProfile
            .withArgs({ userId: 2, limitDate: now })
            .resolves(placementProfile);
          const badgeAcquisition = getOutdatedBadgeAcquisition();
          certificationBadgesService.findLatestBadgeAcquisitions.resolves([badgeAcquisition]);
          complementaryCertificationCourseRepository.getByUserId.resolves([
            domainBuilder.buildComplementaryCertificationCourseWithResults({
              id: 1,
              hasExternalJury: true,
              complementaryCertificationBadgeId: 2,
              results: [
                {
                  id: 3,
                  acquired: true,
                  partnerKey: 'BADGE_KEY',
                  source: 'PIX',
                },
                {
                  id: 4,
                  acquired: false,
                  partnerKey: 'BADGE_KEY',
                  source: 'EXTERNAL',
                },
              ],
            }),
          ]);

          // when
          const certificationEligibility = await getUserCertificationEligibility({
            userId: 2,
            placementProfileService,
            certificationBadgesService,
            complementaryCertificationCourseRepository,
          });

          // then
          expect(certificationEligibility.complementaryCertifications).to.exactlyContain([
            {
              complementaryCertificationBadgeId: 2,
              label: 'BADGE_LABEL',
              imageUrl: 'http://www.image-url.com',
              isOutdated: true,
            },
          ]);
        });
      });
      context('when the user has not yet attended the external examination', function () {
        it('should return the user certification eligibility with the acquired badge', async function () {
          // given
          const placementProfile = { isCertifiable: () => true };
          placementProfileService.getPlacementProfile
            .withArgs({ userId: 2, limitDate: now })
            .resolves(placementProfile);
          const badgeAcquisition = getOutdatedBadgeAcquisition();
          certificationBadgesService.findLatestBadgeAcquisitions.resolves([badgeAcquisition]);
          complementaryCertificationCourseRepository.getByUserId.resolves([
            domainBuilder.buildComplementaryCertificationCourseWithResults({
              id: 1,
              hasExternalJury: true,
              complementaryCertificationBadgeId: 2,
              results: [
                {
                  id: 3,
                  acquired: true,
                  partnerKey: 'BADGE_KEY',
                  source: 'PIX',
                },
              ],
            }),
          ]);

          // when
          const certificationEligibility = await getUserCertificationEligibility({
            userId: 2,
            placementProfileService,
            certificationBadgesService,
            complementaryCertificationCourseRepository,
          });

          // then
          expect(certificationEligibility.complementaryCertifications).to.exactlyContain([
            {
              complementaryCertificationBadgeId: 2,
              label: 'BADGE_LABEL',
              imageUrl: 'http://www.image-url.com',
              isOutdated: true,
            },
          ]);
        });
      });
    });
  });

  function getOutdatedBadgeAcquisition() {
    return domainBuilder.buildCertifiableBadgeAcquisition({
      badgeKey: 'BADGE_KEY',
      complementaryCertificationBadgeId: 2,
      complementaryCertificationBadgeLabel: 'BADGE_LABEL',
      complementaryCertificationBadgeImageUrl: 'http://www.image-url.com',
      isOutdated: true,
    });
  }
});
