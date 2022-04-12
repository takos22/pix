const { expect, databaseBuilder, knex, catchErr } = require('../../../test-helper');

const getUserSettings = require('../../../../lib/domain/usecases/get-user-settings');
const userSettingsRepository = require('../../../../lib/infrastructure/repositories/user-settings-repository');
const { NotFoundError } = require('../../../../lib/domain/errors');

describe('Integration | UseCases | getUserSettings', function () {
  afterEach(async function () {
    await knex('user-settings').delete();
  });

  describe('when user settings does not exist', function () {
    it('should return undefined', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      // when
      const error = await catchErr(getUserSettings)({ userId, userSettingsRepository });

      // then
      expect(error).to.be.an.instanceof(NotFoundError);
    });
  });

  describe('when user settings exist', function () {
    it('should return user settings', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      databaseBuilder.factory.buildUserSettings({ userId, color: 'green' });
      await databaseBuilder.commit();

      // when
      const userSettings = await getUserSettings({ userId, userSettingsRepository });

      // then
      expect(userSettings.color).to.equal('green');
      expect(userSettings.userId).to.equal(userId);
      expect(userSettings.createdAt).to.be.a('date');
      expect(userSettings.updatedAt).to.be.a('date');
    });
  });
});
