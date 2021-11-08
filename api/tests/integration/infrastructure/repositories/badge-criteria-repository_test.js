const { knex, expect, databaseBuilder } = require('../../../test-helper');
const badgeCriteriaRepository = require('../../../../lib/infrastructure/repositories/badge-criteria-repository');
const omit = require('lodash/omit');
const BadgeCriterion = require('../../../../lib/domain/models/BadgeCriterion');

describe('Integration | Repository | Badge Criteria Repository', function () {
  afterEach(async function () {
    await knex('badge-criteria').delete();
    await knex('badges').delete();
  });

  describe('#save', function () {
    it('should save badge-criteria', async function () {
      // given
      const { id: badgeId } = databaseBuilder.factory.buildBadge();
      await databaseBuilder.commit();
      const badgeCriterion = {
        threshold: 90,
        scope: 'CampaignParticipation',
        badgeId,
      };

      const expectedBadgeCriterion = {
        threshold: 90,
        scope: 'CampaignParticipation',
        badgeId,
        skillSetIds: null,
      };

      // when
      const result = await badgeCriteriaRepository.save({ badgeCriterion });

      // then
      expect(result).to.be.instanceOf(BadgeCriterion);
      expect(omit(result, 'id')).to.deep.equal(expectedBadgeCriterion);
    });
  });
});
