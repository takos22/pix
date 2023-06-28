import { buildComplementaryCertification } from './build-complementary-certification.js';
import { CertificationCandidate } from '../../../../lib/certification/shared/models/CertificationCandidate.js';

const buildCertificationCandidate = function ({
  id = 123,
  firstName = 'Poison',
  lastName = 'Ivy',
  sex = 'F',
  birthPostalCode = null,
  birthINSEECode = '75101',
  birthCity = 'Perpignan',
  birthProvinceCode = '66',
  birthCountry = 'France',
  email = 'poison.ivy@example.net',
  resultRecipientEmail = 'napoleon@example.net',
  birthdate = '1990-05-06',
  extraTimePercentage = 0.3,
  externalId = 'externalId',
  createdAt = new Date('2020-01-01'),
  authorizedToStart = false,
  sessionId = 456,
  userId = 789,
  organizationLearnerId,
  complementaryCertification = buildComplementaryCertification(),
  billingMode = null,
  prepaymentCode = null,
} = {}) {
  return new CertificationCandidate({
    id,
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    birthdate,
    sessionId,
    externalId,
    extraTimePercentage,
    createdAt,
    authorizedToStart,
    userId,
    organizationLearnerId,
    complementaryCertification,
    billingMode,
    prepaymentCode,
  });
};

buildCertificationCandidate.pro = function ({
  firstName = 'Poison',
  lastName = 'Ivy',
  sex = 'F',
  birthPostalCode = '75001',
  birthINSEECode = '',
  birthCity = 'Perpignan',
  birthProvinceCode = '66',
  birthCountry = 'France',
  email = 'poison.ivy@example.net',
  resultRecipientEmail = 'napoleon@example.net',
  birthdate = '1990-05-06',
  extraTimePercentage = 0.3,
  externalId = 'externalId',
  authorizedToStart = false,
  sessionId = 456,
  complementaryCertification = null,
  billingMode = 'FREE',
}) {
  return new CertificationCandidate({
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    birthdate,
    sessionId,
    externalId,
    extraTimePercentage,
    authorizedToStart,
    complementaryCertification,
    billingMode,
  });
};

buildCertificationCandidate.notPersisted = function ({
  firstName = 'Poison',
  lastName = 'Ivy',
  sex = 'F',
  birthPostalCode = '75001',
  birthINSEECode = '75101',
  birthCity = 'Perpignan',
  birthProvinceCode = '66',
  birthCountry = 'France',
  email = 'poison.ivy@example.net',
  resultRecipientEmail = 'napoleon@example.net',
  birthdate = '1990-05-06',
  extraTimePercentage = 0.3,
  externalId = 'externalId',
  authorizedToStart = false,
  sessionId = 456,
  complementaryCertification = null,
}) {
  return new CertificationCandidate({
    firstName,
    lastName,
    sex,
    birthPostalCode,
    birthINSEECode,
    birthCity,
    birthProvinceCode,
    birthCountry,
    email,
    resultRecipientEmail,
    birthdate,
    sessionId,
    externalId,
    extraTimePercentage,
    authorizedToStart,
    complementaryCertification,
  });
};

export { buildCertificationCandidate };
