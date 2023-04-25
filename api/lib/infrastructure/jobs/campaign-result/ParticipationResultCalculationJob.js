'use strict';
const Job = require('../JobPgBoss.js');

class ParticipationResultCalculationJob extends Job {
  static name = 'ParticipationResultCalculationJob';
  constructor(queryBuilder) {
    super({ name: 'ParticipationResultCalculationJob', retryLimit: 3 }, queryBuilder);
  }
}

module.exports = ParticipationResultCalculationJob;
