import { CERTIFICATION_CENTER_MEMBERSHIP_ROLES } from '../models/CertificationCenterMembership.js';

const createCertificationCenterMembershipForScoOrganizationMember = async function ({
  membership,
  membershipRepository,
  certificationCenterRepository,
  certificationCenterMembershipRepository,
}) {
  const existingMembership = await membershipRepository.get(membership.id);

  if (!membership.isAdmin || !existingMembership.organization.isScoAndHasExternalId) return;

  const existingCertificationCenter = await certificationCenterRepository.findByExternalId({
    externalId: existingMembership.organization.externalId,
  });

  if (!existingCertificationCenter) return;

  const isAlreadyMemberOfCertificationCenter =
    await certificationCenterMembershipRepository.isMemberOfCertificationCenter({
      userId: existingMembership.user.id,
      certificationCenterId: existingCertificationCenter.id,
    });

  if (isAlreadyMemberOfCertificationCenter) return;

  const adminMembersCount = await certificationCenterMembershipRepository.countAdminMembersForCertificationCenter(
    existingCertificationCenter.id,
  );

  const role =
    adminMembersCount > 0 ? CERTIFICATION_CENTER_MEMBERSHIP_ROLES.MEMBER : CERTIFICATION_CENTER_MEMBERSHIP_ROLES.ADMIN;

  await certificationCenterMembershipRepository.create({
    certificationCenterId: existingCertificationCenter.id,
    role,
    userId: existingMembership.user.id,
  });
};

export { createCertificationCenterMembershipForScoOrganizationMember };
