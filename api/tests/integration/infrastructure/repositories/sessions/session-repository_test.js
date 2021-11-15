const { databaseBuilder, expect, knex, domainBuilder, catchErr } = require('../../../../test-helper');
const _ = require('lodash');
const { NotFoundError } = require('../../../../../lib/domain/errors');
const Session = require('../../../../../lib/domain/models/Session');
const { statuses } = require('../../../../../lib/domain/models/Session');
const sessionRepository = require('../../../../../lib/infrastructure/repositories/sessions/session-repository');

describe('Integration | Repository | Session', function () {
  describe('#save', function () {
    let session, certificationCenter;

    beforeEach(async function () {
      certificationCenter = databaseBuilder.factory.buildCertificationCenter({});
      session = new Session({
        certificationCenter: certificationCenter.name,
        certificationCenterId: certificationCenter.id,
        address: 'Nice',
        room: '28D',
        examiner: 'Michel Essentiel',
        date: '2017-12-08',
        time: '14:30:00',
        description: 'Première certification EVER !!!',
        examinerGlobalComment: 'No comment',
        finalizedAt: new Date('2017-12-07'),
        publishedAt: new Date('2017-12-07'),
        resultsSentToPrescriberAt: new Date('2017-12-07'),
        assignedCertificationOfficerId: null,
        accessCode: 'XXXX',
        supervisorPassword: 'AB2C7',
      });

      await databaseBuilder.commit();
    });

    afterEach(function () {
      return knex('sessions').delete();
    });

    it('should persist the session in db', async function () {
      // when
      await sessionRepository.save(session);

      // then
      const sessionSaved = await knex('sessions').select();
      expect(sessionSaved).to.have.lengthOf(1);
    });

    it('should return the saved Session', async function () {
      // when
      const savedSession = await sessionRepository.save(session);

      // then
      expect(savedSession).to.be.an.instanceOf(Session);
      expect(savedSession).to.have.property('id').and.not.null;
      expect(savedSession).to.deepEqualInstance(new Session({ ...session, id: savedSession.id }));
    });
  });

  describe('#isSessionCodeAvailable', function () {
    beforeEach(function () {
      databaseBuilder.factory.buildSession({
        certificationCenter: 'Paris',
        address: 'Paris',
        room: 'The lost room',
        examiner: 'Bernard',
        date: '2018-02-23',
        time: '12:00',
        description: 'The lost examen',
        accessCode: 'ABC123',
      });

      return databaseBuilder.commit();
    });

    it('should return true if the accessCode is not in database', async function () {
      // given
      const accessCode = 'DEF123';

      // when
      const isAvailable = await sessionRepository.isSessionCodeAvailable(accessCode);

      // then
      expect(isAvailable).to.be.equal(true);
    });

    it('should return false if the accessCode is in database', async function () {
      // given
      const accessCode = 'ABC123';

      // when
      const isAvailable = await sessionRepository.isSessionCodeAvailable(accessCode);

      // then
      expect(isAvailable).to.be.equal(false);
    });
  });

  describe('#isFinalized', function () {
    let finalizedSessionId;
    let notFinalizedSessionId;

    beforeEach(function () {
      finalizedSessionId = databaseBuilder.factory.buildSession({ finalizedAt: new Date() }).id;
      notFinalizedSessionId = databaseBuilder.factory.buildSession({ finalizedAt: null }).id;

      return databaseBuilder.commit();
    });

    it('should return true if the session status is finalized', async function () {
      // when
      const isFinalized = await sessionRepository.isFinalized(finalizedSessionId);

      // then
      expect(isFinalized).to.be.equal(true);
    });

    it('should return false if the session status is not finalized', async function () {
      // when
      const isFinalized = await sessionRepository.isFinalized(notFinalizedSessionId);

      // then
      expect(isFinalized).to.be.equal(false);
    });
  });

  describe('#get', function () {
    let session;
    let expectedSessionValues;

    beforeEach(async function () {
      // given
      session = databaseBuilder.factory.buildSession({
        certificationCenter: 'Tour Gamma',
        address: 'rue de Bercy',
        room: 'Salle A',
        examiner: 'Monsieur Examinateur',
        date: '2018-02-23',
        time: '12:00:00',
        description: 'CertificationPix pour les jeunes',
        accessCode: 'NJR10',
      });
      expectedSessionValues = {
        id: session.id,
        certificationCenter: session.certificationCenter,
        address: session.address,
        room: session.room,
        examiner: session.examiner,
        date: session.date,
        time: session.time,
        description: session.description,
        accessCode: session.accessCode,
      };
      await databaseBuilder.commit();
    });

    it('should return session informations in a session Object', async function () {
      // when
      const actualSession = await sessionRepository.get(session.id);

      // then
      expect(actualSession).to.be.instanceOf(Session);
      expect(actualSession, 'date').to.deep.includes(expectedSessionValues);
    });

    it('should return a Not found error when no session was found', async function () {
      // when
      const error = await catchErr(sessionRepository.get)(2);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  describe('#getWithCertificationCandidates', function () {
    let session;
    let expectedSessionValues;

    beforeEach(async function () {
      // given
      session = databaseBuilder.factory.buildSession({
        certificationCenter: 'Tour Gamma',
        address: 'rue de Bercy',
        room: 'Salle A',
        examiner: 'Monsieur Examinateur',
        date: '2018-02-23',
        time: '12:00:00',
        description: 'CertificationPix pour les jeunes',
        accessCode: 'NJR10',
      });
      expectedSessionValues = {
        id: session.id,
        certificationCenter: session.certificationCenter,
        address: session.address,
        room: session.room,
        examiner: session.examiner,
        date: session.date,
        time: session.time,
        description: session.description,
        accessCode: session.accessCode,
      };
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Michael',
        sessionId: session.id,
      });
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Stardust',
        firstName: 'Ziggy',
        sessionId: session.id,
      });
      databaseBuilder.factory.buildCertificationCandidate({
        lastName: 'Jackson',
        firstName: 'Janet',
        sessionId: session.id,
      });
      _.times(5, () => databaseBuilder.factory.buildCertificationCandidate());
      await databaseBuilder.commit();
    });

    it('should return session information in a session Object', async function () {
      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      expect(actualSession).to.be.instanceOf(Session);
      expect(actualSession).to.deep.includes(expectedSessionValues);
    });

    it('should return associated certification candidates ordered by lastname and firstname', async function () {
      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      const actualCandidates = _.map(actualSession.certificationCandidates, (item) =>
        _.pick(item, ['sessionId', 'lastName', 'firstName'])
      );
      expect(actualCandidates).to.have.deep.ordered.members([
        { sessionId: session.id, lastName: 'Jackson', firstName: 'Janet' },
        { sessionId: session.id, lastName: 'Jackson', firstName: 'Michael' },
        { sessionId: session.id, lastName: 'Stardust', firstName: 'Ziggy' },
      ]);
    });

    it('should return an empty certification candidates array if there is no candidates', async function () {
      // given
      const session = databaseBuilder.factory.buildSession();
      await databaseBuilder.commit();

      // when
      const actualSession = await sessionRepository.getWithCertificationCandidates(session.id);

      // then
      expect(actualSession.certificationCandidates).to.deep.equal([]);
    });

    it('should return a Not found error when no session was found', async function () {
      // when
      const error = await catchErr(sessionRepository.get)(session.id + 1);

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });

  describe('#updateSessionInfo', function () {
    let session;

    beforeEach(function () {
      const savedSession = databaseBuilder.factory.buildSession();
      session = domainBuilder.buildSession(savedSession);
      session.room = 'New room';
      session.examiner = 'New examiner';
      session.address = 'New address';
      session.accessCode = 'BABAAURHUM';
      session.date = '2010-01-01';
      session.time = '12:00:00';
      session.description = 'New description';

      return databaseBuilder.commit();
    });

    it('should return a Session domain object', async function () {
      // when
      const sessionSaved = await sessionRepository.updateSessionInfo(session);

      // then
      expect(sessionSaved).to.be.an.instanceof(Session);
    });

    it('should update model in database', async function () {
      // given

      // when
      const sessionSaved = await sessionRepository.updateSessionInfo(session);

      // then
      expect(sessionSaved.id).to.equal(session.id);
      expect(sessionSaved.room).to.equal(session.room);
      expect(sessionSaved.examiner).to.equal(session.examiner);
      expect(sessionSaved.address).to.equal(session.address);
      expect(sessionSaved.accessCode).to.equal(session.accessCode);
      expect(sessionSaved.date).to.equal(session.date);
      expect(sessionSaved.time).to.equal(session.time);
      expect(sessionSaved.description).to.equal(session.description);
    });
  });

  describe('#doesUserHaveCertificationCenterMembershipForSession', function () {
    let userId, userIdNotAllowed, sessionId, certificationCenterId, certificationCenterNotAllowedId;

    beforeEach(async function () {
      // given
      userId = 1;
      userIdNotAllowed = 2;
      databaseBuilder.factory.buildUser({ id: userId });
      databaseBuilder.factory.buildUser({ id: userIdNotAllowed });
      certificationCenterId = databaseBuilder.factory.buildCertificationCenter().id;
      certificationCenterNotAllowedId = databaseBuilder.factory.buildCertificationCenter().id;
      databaseBuilder.factory.buildCertificationCenterMembership({ userId, certificationCenterId });
      databaseBuilder.factory.buildCertificationCenterMembership({
        userId: userIdNotAllowed,
        certificationCenterId: certificationCenterNotAllowedId,
      });

      // when
      sessionId = databaseBuilder.factory.buildSession({ certificationCenterId }).id;

      await databaseBuilder.commit();
    });

    it('should return true if user has membership in the certification center that originated the session', async function () {
      // when
      const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
        userId,
        sessionId
      );

      // then
      expect(hasMembership).to.be.true;
    });

    it('should return false if user has no membership in the certification center that originated the session', async function () {
      // when
      const hasMembership = await sessionRepository.doesUserHaveCertificationCenterMembershipForSession(
        userIdNotAllowed,
        sessionId
      );

      // then
      expect(hasMembership).to.be.false;
    });
  });

  describe('#finalize', function () {
    let id;
    const examinerGlobalComment = '';
    const finalizedAt = new Date('2017-09-01T12:14:33Z');

    beforeEach(function () {
      id = databaseBuilder.factory.buildSession({ finalizedAt: null }).id;

      return databaseBuilder.commit();
    });

    it('should return an updated Session domain object', async function () {
      // when
      const sessionSaved = await sessionRepository.finalize({ id, examinerGlobalComment, finalizedAt });

      // then
      expect(sessionSaved).to.be.an.instanceof(Session);
      expect(sessionSaved.id).to.deep.equal(id);
      expect(sessionSaved.examinerGlobalComment).to.deep.equal(examinerGlobalComment);
      expect(sessionSaved.status).to.deep.equal(statuses.FINALIZED);
    });
  });

  describe('#flagResultsAsSentToPrescriber', function () {
    let id;
    const resultsSentToPrescriberAt = new Date('2017-09-01T12:14:33Z');

    beforeEach(function () {
      id = databaseBuilder.factory.buildSession({ resultsSentToPrescriberAt: null }).id;

      return databaseBuilder.commit();
    });

    it('should return a flagged Session domain object', async function () {
      // when
      const sessionFlagged = await sessionRepository.flagResultsAsSentToPrescriber({ id, resultsSentToPrescriberAt });

      // then
      expect(sessionFlagged).to.be.an.instanceof(Session);
      expect(sessionFlagged.id).to.deep.equal(id);
      expect(sessionFlagged.resultsSentToPrescriberAt).to.deep.equal(resultsSentToPrescriberAt);
    });
  });

  describe('#updatePublishedAt', function () {
    let id;
    const publishedAt = new Date('2017-09-01T12:14:33Z');

    beforeEach(function () {
      id = databaseBuilder.factory.buildSession({ publishedAt: null }).id;

      return databaseBuilder.commit();
    });

    it('should return a updated Session domain object', async function () {
      // when
      const sessionFlagged = await sessionRepository.updatePublishedAt({ id, publishedAt });

      // then
      expect(sessionFlagged).to.be.an.instanceof(Session);
      expect(sessionFlagged.id).to.deep.equal(id);
      expect(sessionFlagged.publishedAt).to.deep.equal(publishedAt);
    });
  });
});
