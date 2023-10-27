import { createOrganization } from '../common/tooling/organization-tooling.js';
import { createCertificationCenter } from '../common/tooling/certification-center-tooling.js';
import { REAL_PIX_SUPER_ADMIN_ID } from '../common/common-builder.js';

export async function buildSeedsForPix5000UseCases(databaseBuilder) {
  await _buildUseCase1(databaseBuilder);
  await _buildUseCase2(databaseBuilder);
  await _buildUseCase3(databaseBuilder);
}

async function _buildUseCase1(databaseBuilder) {
  databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Aoi',
    lastName: 'Todo',
    email: 'aoi.todo@example.net',
    username: 'aoi.todo',
  });

  const externalId = 'PIX5000UC1';
  const name = 'PIX5000 UC1';
  const type = 'SCO';

  await createOrganization({
    databaseBuilder,
    name,
    type,
    isManagingStudents: true,
    createdBy: REAL_PIX_SUPER_ADMIN_ID,
    externalId,
  });
  await createCertificationCenter({ databaseBuilder, name, type, externalId });
}

async function _buildUseCase2(databaseBuilder) {
  const organizationMemberId = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Yūji',
    lastName: 'Itadori',
    email: 'yuji.itadori@example.net',
    username: 'yuji.itadori',
  }).id;

  const externalId = 'PIX5000UC2';
  const name = 'PIX5000 UC2';
  const type = 'SCO';

  await createOrganization({
    databaseBuilder,
    name,
    type,
    isManagingStudents: true,
    createdBy: REAL_PIX_SUPER_ADMIN_ID,
    externalId,
    memberIds: [organizationMemberId],
  });
  await createCertificationCenter({ databaseBuilder, name, type, externalId });
}

async function _buildUseCase3(databaseBuilder) {
  const organizationAdminId = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Satoru',
    lastName: 'Gojō',
    email: 'satoru.gojo@example.net',
    username: 'satoru.gojo',
  }).id;
  const organizationMemberId = databaseBuilder.factory.buildUser.withRawPassword({
    firstName: 'Megumi',
    lastName: 'Fushiguro',
    email: 'megumi.fushiguro@example.net',
    username: 'megumi.fushiguro',
  }).id;

  const externalId = 'PIX5000UC3';
  const name = 'PIX5000 UC3';
  const type = 'SCO';

  await createOrganization({
    databaseBuilder,
    name,
    type,
    isManagingStudents: true,
    createdBy: REAL_PIX_SUPER_ADMIN_ID,
    externalId,
    adminIds: [organizationAdminId],
    memberIds: [organizationMemberId],
  });
  await createCertificationCenter({ databaseBuilder, name, type, externalId });
}
