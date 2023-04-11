import { CertificationPointOfContact } from '../../../../lib/domain/read-models/CertificationPointOfContact.js';
import { buildAllowedCertificationCenterAccess } from './build-allowed-certification-center-access.js';

const buildCertificationPointOfContact = function ({
  id = 123,
  firstName = 'Chèvre',
  lastName = 'Brebis',
  email = 'chevre.brebis@example.net',
  pixCertifTermsOfServiceAccepted = true,
  allowedCertificationCenterAccesses = [buildAllowedCertificationCenterAccess()],
} = {}) {
  return new CertificationPointOfContact({
    id,
    firstName,
    lastName,
    email,
    pixCertifTermsOfServiceAccepted,
    allowedCertificationCenterAccesses,
  });
};

export { buildCertificationPointOfContact };
