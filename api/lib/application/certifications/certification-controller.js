import { usecases } from '../../domain/usecases/index.js';
import { events } from '../../domain/events/index.js';
import * as privateCertificateSerializer from '../../infrastructure/serializers/jsonapi/private-certificate-serializer.js';
import * as shareableCertificateSerializer from '../../infrastructure/serializers/jsonapi/shareable-certificate-serializer.js';
import { certificationAttestationPdf } from '../../infrastructure/utils/pdf/certification-attestation-pdf.js';
import { requestResponseUtils } from '../../infrastructure/utils/request-response-utils.js';

import moment from 'moment';

const findUserCertifications = async function (request) {
  const userId = request.auth.credentials.userId;

  const privateCertificates = await usecases.findUserPrivateCertificates({ userId });
  return privateCertificateSerializer.serialize(privateCertificates);
};

const getCertification = async function (request) {
  const userId = request.auth.credentials.userId;
  const certificationId = request.params.id;
  const locale = requestResponseUtils.extractLocaleFromRequest(request);

  const privateCertificate = await usecases.getPrivateCertificate({
    userId,
    certificationId,
    locale,
  });
  return privateCertificateSerializer.serialize(privateCertificate);
};

const getCertificationByVerificationCode = async function (request) {
  const verificationCode = request.payload.verificationCode;
  const locale = requestResponseUtils.extractLocaleFromRequest(request);

  const shareableCertificate = await usecases.getShareableCertificate({ verificationCode, locale });
  return shareableCertificateSerializer.serialize(shareableCertificate);
};

const getPDFAttestation = async function (request, h) {
  const userId = request.auth.credentials.userId;
  const certificationId = request.params.id;
  const isFrenchDomainExtension = request.query.isFrenchDomainExtension;
  const attestation = await usecases.getCertificationAttestation({
    userId,
    certificationId,
  });

  const { buffer } = await certificationAttestationPdf.getCertificationAttestationsPdfBuffer({
    certificates: [attestation],
    isFrenchDomainExtension,
  });

  const fileName = `attestation-pix-${moment(attestation.deliveredAt).format('YYYYMMDD')}.pdf`;
  return h
    .response(buffer)
    .header('Content-Disposition', `attachment; filename=${fileName}`)
    .header('Content-Type', 'application/pdf');
};

const neutralizeChallenge = async function (request, h) {
  const challengeRecId = request.payload.data.attributes.challengeRecId;
  const certificationCourseId = request.payload.data.attributes.certificationCourseId;
  const juryId = request.auth.credentials.userId;
  const event = await usecases.neutralizeChallenge({
    challengeRecId,
    certificationCourseId,
    juryId,
  });
  await events.eventDispatcher.dispatch(event);
  return h.response().code(204);
};

const deneutralizeChallenge = async function (request, h) {
  const challengeRecId = request.payload.data.attributes.challengeRecId;
  const certificationCourseId = request.payload.data.attributes.certificationCourseId;
  const juryId = request.auth.credentials.userId;
  const event = await usecases.deneutralizeChallenge({
    challengeRecId,
    certificationCourseId,
    juryId,
  });
  await events.eventDispatcher.dispatch(event);
  return h.response().code(204);
};

export {
  findUserCertifications,
  getCertification,
  getCertificationByVerificationCode,
  getPDFAttestation,
  neutralizeChallenge,
  deneutralizeChallenge,
};
