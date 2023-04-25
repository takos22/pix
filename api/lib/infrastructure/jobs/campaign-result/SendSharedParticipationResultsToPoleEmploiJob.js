'use strict';
const Job = require('../JobPgBoss.js');

class SendSharedParticipationResultsToPoleEmploi extends Job {
  static name = 'SendSharedParticipationResultsToPoleEmploi';
  constructor(queryBuilder) {
    super({ name: 'SendSharedParticipationResultsToPoleEmploi', retryLimit: 0 }, queryBuilder);
  }
}

module.exports = SendSharedParticipationResultsToPoleEmploi;
