const { expect, sinon, domainBuilder } = require('../../../../test-helper');
const sessionsImportValidationService = require('../../../../../lib/domain/services/sessions-mass-import/sessions-import-validation-service');
const { CpfBirthInformationValidation } = require('../../../../../lib/domain/services/certification-cpf-service');
const certificationCpfService = require('../../../../../lib/domain/services/certification-cpf-service');

describe('Unit | Service | sessions import validation Service', function () {
  describe('#validateSession', function () {
    let clock;
    let sessionRepository;
    let certificationCourseRepository;

    beforeEach(function () {
      clock = sinon.useFakeTimers({
        now: new Date('2023-01-01'),
        toFake: ['Date'],
      });
      sessionRepository = { isSessionExisting: sinon.stub() };
      certificationCourseRepository = { findCertificationCoursesBySessionId: sinon.stub() };
    });

    afterEach(async function () {
      clock.restore();
    });

    context('when the parsed data is valid', function () {
      context('when the session has not started yet', function () {
        context('when there is no sessionId', function () {
          it('should return an empty sessionErrors array', async function () {
            // given
            const session = _buildValidSessionWithoutId();
            sessionRepository.isSessionExisting.withArgs({ ...session }).resolves(false);

            // when
            const sessionErrors = await sessionsImportValidationService.validateSession({
              session,
              line: 1,
              sessionRepository,
              certificationCourseRepository,
            });

            // then
            expect(sessionErrors).to.be.empty;
          });
        });

        context('when there is a sessionId', function () {
          it('should return an empty sessionErrors array', async function () {
            // given
            const sessionId = 1;
            const session = _buildValidSessionWithId(sessionId);
            certificationCourseRepository.findCertificationCoursesBySessionId.resolves([]);

            // when
            const sessionErrors = await sessionsImportValidationService.validateSession({
              session,
              line: 1,
              sessionRepository,
              certificationCourseRepository,
            });

            // then
            expect(sessionErrors).to.be.empty;
          });
        });
      });
    });

    context('when the session has already started', function () {
      it('should return an errorReport that contains an already started error', async function () {
        const session = _buildValidSessionWithId(1234);
        certificationCourseRepository.findCertificationCoursesBySessionId
          .withArgs({ sessionId: 1234 })
          .resolves([domainBuilder.buildCertificationCourse({ sessionId: 1234 })]);

        // when
        const sessionErrors = await sessionsImportValidationService.validateSession({
          session,
          line: 2,
          sessionRepository,
          certificationCourseRepository,
        });

        // then
        expect(sessionErrors).to.deep.equal([
          {
            line: 2,
            code: 'CANDIDATE_NOT_ALLOWED_FOR_STARTED_SESSION',
          },
        ]);
      });
    });

    context('date validation', function () {
      context('when at least one session is scheduled in the past', function () {
        it('should return an sessionErrors that contains a no session scheduled in the past error', async function () {
          // given
          const session = _buildValidSessionWithoutId();
          session.date = '2020-03-12';

          // when
          const sessionErrors = await sessionsImportValidationService.validateSession({
            session,
            line: 1,
            sessionRepository,
            certificationCourseRepository,
          });

          // then
          expect(sessionErrors).to.deep.equal([
            {
              line: 1,
              code: 'SESSION_SCHEDULED_IN_THE_PAST',
            },
          ]);
        });
      });
    });

    context('conflicting session information validation', function () {
      context('when there is a sessionId and session information', function () {
        it('should return an sessionErrors that contains an already given ID error', async function () {
          // given
          const session = _buildValidSessionWithoutId();
          session.id = 1234;
          certificationCourseRepository.findCertificationCoursesBySessionId.withArgs({ sessionId: 1234 }).resolves([]);

          // when
          const sessionErrors = await sessionsImportValidationService.validateSession({
            session,
            line: 1,
            sessionRepository,
            certificationCourseRepository,
          });

          // then
          expect(sessionErrors).to.deep.equal([
            {
              line: 1,
              code: 'INFORMATION_NOT_ALLOWED_WITH_SESSION_ID',
            },
          ]);
        });
      });

      context('when there is session information but no sessionId', function () {
        it('should return an empty sessionErrors array', async function () {
          const session = domainBuilder.buildSession({
            ..._createValidSessionData(),
            id: null,
            certificationCandidates: [],
          });

          // when
          const sessionErrors = await sessionsImportValidationService.validateSession({
            session,
            line: 1,
            sessionRepository,
            certificationCourseRepository,
          });

          // then
          expect(sessionErrors).to.be.empty;
        });
      });
    });

    context('when there already is an existing session with the same data as a newly imported one', function () {
      it('should return an sessionErrors that contains a session already existing error', async function () {
        // given
        const session = _buildValidSessionWithoutId();
        sessionRepository.isSessionExisting.withArgs({ ...session }).resolves(true);

        // when
        const sessionErrors = await sessionsImportValidationService.validateSession({
          session,
          line: 1,
          sessionRepository,
          certificationCourseRepository,
        });

        // then
        expect(sessionErrors).to.deep.equal([
          {
            line: 1,
            code: 'SESSION_WITH_DATE_AND_TIME_ALREADY_EXISTS',
          },
        ]);
      });
    });

    context('when session has certification candidates', function () {
      context('when at least one candidate is duplicated', function () {
        it('should return an sessionErrors that contains a duplicate candidate error', async function () {
          // given
          const validCandidateData = _buildValidCandidateData(1);
          const validCandidateDataDuplicate = _buildValidCandidateData(1);
          const session = _buildValidSessionWithoutId();
          session.certificationCandidates = [validCandidateData, validCandidateDataDuplicate];

          // when
          const sessionErrors = await sessionsImportValidationService.validateSession({
            session,
            line: 1,
            sessionRepository,
            certificationCourseRepository,
          });

          // then
          expect(sessionErrors).to.deep.equal([
            {
              line: 1,
              code: 'DUPLICATE_CANDIDATE_NOT_ALLOWED_IN_SESSION',
            },
          ]);
        });
      });
    });

    context('when session has one invalid field', function () {
      it('should return an sessionErrors that contains a session invalid field error', async function () {
        // given
        const session = _buildValidSessionWithoutId();
        session.room = null;

        // when
        const sessionErrors = await sessionsImportValidationService.validateSession({
          session,
          line: 1,
          sessionRepository,
          certificationCourseRepository,
        });

        // then
        expect(sessionErrors).to.deep.equal([
          {
            line: 1,
            code: 'SESSION_ROOM_REQUIRED',
          },
        ]);
      });
    });

    context('when session has more than one invalid fields', function () {
      it('should return an sessionErrors that contains all session errors', async function () {
        // given
        const session = _buildValidSessionWithoutId();
        session.room = null;
        session.address = null;

        // when
        const sessionErrors = await sessionsImportValidationService.validateSession({
          session,
          line: 1,
          sessionRepository,
          certificationCourseRepository,
        });

        // then
        expect(sessionErrors).to.have.deep.members([
          { line: 1, code: 'SESSION_ADDRESS_REQUIRED' },
          { line: 1, code: 'SESSION_ROOM_REQUIRED' },
        ]);
      });
    });
  });

  describe('#getValidatedCandidateBirthInformation', function () {
    beforeEach(function () {
      sinon.stub(certificationCpfService, 'getBirthInformation');
    });

    context('when the parsed data is valid', function () {
      it('should return an empty certificationCandidateErrors', async function () {
        // given
        const candidateInformation = {
          birthCountry: 'Pérou',
          birthCity: 'Pétaouchnok',
          birthPostalCode: '44329',
          birthINSEECode: '67890',
        };
        const candidate = _buildValidCandidateData();

        certificationCpfService.getBirthInformation.resolves(
          CpfBirthInformationValidation.success(candidateInformation)
        );

        // when
        const { certificationCandidateErrors } =
          await sessionsImportValidationService.getValidatedCandidateBirthInformation({
            candidate,
            isSco: false,
          });

        // then
        expect(certificationCandidateErrors).to.be.empty;
      });
    });

    context('when candidate parsed data is invalid', function () {
      it('should return an certificationCandidateErrors containing the specific error', async function () {
        // given
        const isSco = false;
        const candidate = _buildValidCandidateData();
        candidate.firstName = null;
        certificationCpfService.getBirthInformation.resolves(CpfBirthInformationValidation.success({ ...candidate }));

        // when
        const { certificationCandidateErrors } =
          await sessionsImportValidationService.getValidatedCandidateBirthInformation({
            candidate,
            isSco,
            line: 1,
          });

        // then
        expect(certificationCandidateErrors).to.deep.equal([
          {
            code: 'CANDIDATE_FIRST_NAME_REQUIRED',
            line: 1,
          },
        ]);
      });
    });

    context('when candidate has extra time percentage below 1', function () {
      it('should return a certificationCandidateErrors containing the specific error ', async function () {
        // given
        const candidate = _buildValidCandidateData();
        candidate.extraTimePercentage = '0.20';

        certificationCpfService.getBirthInformation.resolves(CpfBirthInformationValidation.success({}));

        // when
        const { certificationCandidateErrors } =
          await sessionsImportValidationService.getValidatedCandidateBirthInformation({
            candidate,
          });

        // then
        expect(certificationCandidateErrors).to.deep.equal(['Temps majoré doit être supérieur à 1']);
      });
    });

    context('when candidate has missing billing information', function () {
      context('when the parsed candidate is not sco', function () {
        it('should return an certificationCandidateErrors containing billing mode errors', async function () {
          // given
          const isSco = false;
          const candidate = _buildValidCandidateData();
          candidate.billingMode = null;
          certificationCpfService.getBirthInformation.resolves(CpfBirthInformationValidation.success({ ...candidate }));

          // when
          const { certificationCandidateErrors } =
            await sessionsImportValidationService.getValidatedCandidateBirthInformation({
              candidate,
              isSco,
              line: 1,
            });

          // then
          expect(certificationCandidateErrors).to.deep.equal([
            {
              code: 'CANDIDATE_BILLING_MODE_REQUIRED',
              line: 1,
            },
          ]);
        });
      });

      context('when the parsed candidate is sco', function () {
        it('should return an empty certificationCandidateErrors', async function () {
          // given
          const isSco = true;
          const candidateInformation = {
            birthCountry: 'Pérou',
            birthCity: 'Pétaouchnok',
            birthPostalCode: '44329',
            birthINSEECode: '67890',
          };
          const candidate = _buildValidCandidateData();
          candidate.billingMode = null;

          certificationCpfService.getBirthInformation.resolves(
            CpfBirthInformationValidation.success(candidateInformation)
          );

          // when
          const { certificationCandidateErrors } =
            await sessionsImportValidationService.getValidatedCandidateBirthInformation({
              candidate,
              isSco,
            });

          // then
          expect(certificationCandidateErrors).to.be.empty;
        });
      });
    });

    context('when the parsed candidate data has invalid CPF information', function () {
      it('should return a certificationCandidateErrors that contains the incorrect CPF message', async function () {
        // given
        const candidate = _buildValidCandidateData();
        const certificationCpfCountryRepository = Symbol();
        const certificationCpfCityRepository = Symbol();
        certificationCpfService.getBirthInformation
          .withArgs({
            birthCountry: candidate.birthCountry,
            birthCity: candidate.birthCity,
            birthPostalCode: candidate.birthPostalCode,
            birthINSEECode: candidate.birthINSEECode,
            certificationCpfCountryRepository,
            certificationCpfCityRepository,
          })
          .resolves(CpfBirthInformationValidation.failure('CPF incorrect.'));

        // when
        const result = await sessionsImportValidationService.getValidatedCandidateBirthInformation({
          candidate,
          isSco: false,
          certificationCpfCountryRepository,
          certificationCpfCityRepository,
        });

        // then
        expect(result.certificationCandidateErrors).to.deep.equal(['CPF incorrect.']);
      });
    });
  });
});

function _createValidSessionData() {
  return {
    sessionId: undefined,
    address: 'Site 1',
    room: 'Salle 1',
    date: '2023-03-12',
    time: '01:00',
    examiner: 'Pierre',
    description: 'desc',
    certificationCandidates: [],
  };
}

function _buildValidSessionWithId(sessionId) {
  return domainBuilder.buildSession({
    id: sessionId,
    address: null,
    room: null,
    date: null,
    time: null,
    examiner: null,
    description: null,
    certificationCandidates: null,
  });
}

function _buildValidSessionWithoutId() {
  return domainBuilder.buildSession({
    id: null,
    date: '2024-03-12',
  });
}

function _buildValidCandidateData(candidateNumber = 2) {
  return domainBuilder.buildCertificationCandidate({
    lastName: `Candidat ${candidateNumber}`,
    firstName: `Candidat ${candidateNumber}`,
    birthdate: '1981-03-12',
    sex: 'M',
    birthINSEECode: '134',
    birthPostalCode: null, //'3456',
    birthCity: '',
    birthCountry: 'France',
    resultRecipientEmail: 'robindahood@email.fr',
    email: 'robindahood2@email.fr',
    externalId: 'htehte',
    extraTimePercentage: '20',
    billingMode: 'PAID',
  });
}
