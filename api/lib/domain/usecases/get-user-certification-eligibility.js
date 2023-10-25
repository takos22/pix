import { CertificationEligibility } from '../read-models/CertificationEligibility.js';

const getUserCertificationEligibility = async function ({
  userId,
  placementProfileService,
  certificationBadgesService,
  limitDate = new Date(),
  complementaryCertificationCourseRepository,
}) {
  const placementProfile = await placementProfileService.getPlacementProfile({ userId, limitDate });
  const pixCertificationEligible = placementProfile.isCertifiable();

  if (!pixCertificationEligible) {
    return CertificationEligibility.notCertifiable({ userId });
  }

  const stillValidBadgeAcquisitions = await certificationBadgesService.findLatestBadgeAcquisitions({
    userId,
    limitDate,
  });

  const complementaryCertificationsEligibles = stillValidBadgeAcquisitions.map(
    ({
      complementaryCertificationBadgeId,
      complementaryCertificationBadgeLabel,
      complementaryCertificationBadgeImageUrl,
      isOutdated,
    }) => ({
      complementaryCertificationBadgeId,
      label: complementaryCertificationBadgeLabel,
      imageUrl: complementaryCertificationBadgeImageUrl,
      isOutdated,
    }),
  );

  const complementaryCertificationsTakenByUser = await complementaryCertificationCourseRepository.getByUserId({
    userId,
  });

  const complementaryCertificationsNotAcquired = complementaryCertificationsTakenByUser.filter(
    (complementaryCertification) => !complementaryCertification.isAcquired(),
  );

  const complementaryCertificationsEligiblesNotYetAcquired = complementaryCertificationsEligibles.filter(
    (complementaryCertificationsAccessible) =>
      complementaryCertificationsNotAcquired.some(
        ({ complementaryCertificationBadgeId }) =>
          complementaryCertificationBadgeId === complementaryCertificationsAccessible.complementaryCertificationBadgeId,
      ),
  );

  return new CertificationEligibility({
    id: userId,
    pixCertificationEligible,
    complementaryCertifications: complementaryCertificationsEligiblesNotYetAcquired,
  });
};

export { getUserCertificationEligibility };
