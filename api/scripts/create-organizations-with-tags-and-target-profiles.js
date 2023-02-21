// Usage: node create-organizations-with-tags-and-target-profiles.js path/file.csv
// To use on file with columns |type, externalId, name, provinceCode, credit, emailInvitations, emailForSCOActivation, organizationInvitationRole, locale, tags, createdBy, targetProfiles, isManagingStudents, identityProviderForCampaigns, DPOFirstName, DPOLastName, DPOEmail|

'use strict';
import dotenv from 'dotenv';
dotenv.config();

import { checkCsvHeader, parseCsvWithHeader } from './helpers/csvHelpers';
import temporaryStorage from '../lib/infrastructure/temporary-storage';
import createOrganizationsWithTagsAndTargetProfiles from '../lib/domain/usecases/create-organizations-with-tags-and-target-profiles';
import domainTransaction from '../lib/infrastructure/DomainTransaction';
import organizationInvitationRepository from '../lib/infrastructure/repositories/organization-invitation-repository';
import organizationRepository from '../lib/infrastructure/repositories/organization-repository';
import dataProtectionOfficerRepository from '../lib/infrastructure/repositories/data-protection-officer-repository';
import organizationTagRepository from '../lib/infrastructure/repositories/organization-tag-repository';
import tagRepository from '../lib/infrastructure/repositories/tag-repository';
import targetProfileShareRepository from '../lib/infrastructure/repositories/target-profile-share-repository';
import { disconnect } from '../db/knex-database-connection';
import { isEmpty } from 'lodash';

const REQUIRED_FIELD_NAMES = [
  'type',
  'externalId',
  'name',
  'provinceCode',
  'credit',
  'emailInvitations',
  'emailForSCOActivation',
  'identityProviderForCampaigns',
  'organizationInvitationRole',
  'locale',
  'tags',
  'createdBy',
  'documentationUrl',
  'targetProfiles',
  'isManagingStudents',
  'DPOFirstName',
  'DPOLastName',
  'DPOEmail',
];

const batchOrganizationOptionsWithHeader = {
  skipEmptyLines: true,
  header: true,
  transform: (value, columnName) => {
    if (typeof value === 'string') {
      value = value.trim();
    }
    if (columnName === 'isManagingStudents') {
      value = value?.toLowerCase() === 'true';
    }
    if (!isEmpty(value)) {
      if (
        columnName === 'type' ||
        columnName === 'organizationInvitationRole' ||
        columnName === 'identityProviderForCampaigns'
      ) {
        value = value.toUpperCase();
      }
      if (columnName === 'createdBy') {
        value = parseInt(value, 10);
      }
      if (columnName === 'emailInvitations' || columnName === 'emailForSCOActivation' || columnName === 'DPOEmail') {
        value = value.replaceAll(' ', '').toLowerCase();
      }
    } else {
      if (columnName === 'credit') {
        value = 0;
      }
      if (
        columnName === 'identityProviderForCampaigns' ||
        columnName === 'DPOFirstName' ||
        columnName === 'DPOLastName' ||
        columnName === 'DPOEmail'
      ) {
        value = null;
      }
      if (columnName === 'locale') {
        value = 'fr-fr';
      }
    }
    return value;
  },
};

async function createOrganizationWithTagsAndTargetProfiles(filePath) {
  await checkCsvHeader({
    filePath,
    requiredFieldNames: REQUIRED_FIELD_NAMES,
  });

  console.log('Reading and parsing csv data file... ');

  const organizations = await parseCsvWithHeader(filePath, batchOrganizationOptionsWithHeader);

  console.log('Creating PRO organizations with tags and target profiles..');
  const createdOrganizations = await createOrganizationsWithTagsAndTargetProfiles({
    organizations,
    domainTransaction,
    organizationRepository,
    tagRepository,
    targetProfileShareRepository,
    organizationTagRepository,
    organizationInvitationRepository,
    dataProtectionOfficerRepository,
  });
  console.log('Done.\n');

  createdOrganizations.forEach((createdOrganization) => {
    console.log(`${createdOrganization.id},${createdOrganization.name}`);
  });
}

const isLaunchedFromCommandLine = require.main === module;

async function main() {
  console.log('Starting creating PRO organizations with tags and target profiles.');
  const filePath = process.argv[2];
  await createOrganizationWithTagsAndTargetProfiles(filePath);
}

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
      console.log('\nOrganizations created with success !');
    } catch (error) {
      console.error(error);
      process.exitCode = 1;
    } finally {
      await disconnect();
      // l'import de OidcIdentityProviders dans les validateurs démarre le service redis
      // il faut donc stopper le process pour que celui ci s'arrête, il suffit d'avoir l'import du storage pour y avoir accès
      temporaryStorage.quit();
    }
  }
})();

export default {
  createOrganizationWithTagsAndTargetProfiles,
  batchOrganizationOptionsWithHeader,
};
