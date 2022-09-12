const { expect, databaseBuilder } = require('../../../test-helper');
const userOrganizationsForAdminRepository = require('../../../../lib/infrastructure/repositories/user-organizations-for-admin-repository');

describe('Integration | Repository | user-organizations-for-admin', function () {
  context('#findByUserId', function () {
    it('should return an empty list when user has no organization', async function () {
      // given
      const user = databaseBuilder.factory.buildUser({ firstName: 'Otto', lastName: 'KARR' });
      await databaseBuilder.commit();

      // when
      const userOrganizations = await userOrganizationsForAdminRepository.findByUserId(user.id);

      // then
      expect(userOrganizations).to.be.an('array').that.is.empty;
    });

    it('should return the list of the user’s organizations', async function () {
      const user = databaseBuilder.factory.buildUser({ firstName: 'Otto', lastName: 'KARR' });
      // given

      const organization1 = databaseBuilder.factory.buildOrganization({
        name: 'Organization 1',
      });
      const organization2 = databaseBuilder.factory.buildOrganization({
        name: 'Organization 2',
      });
      const organization3 = databaseBuilder.factory.buildOrganization({
        name: 'Organization 3',
      });

      databaseBuilder.factory.buildMembership({
        organizationId: organization1.id,
        userId: user.id,
        disabledAt: '2001-01-01',
      });
      databaseBuilder.factory.buildMembership({
        organizationId: organization2.id,
        userId: user.id,
        organizationRole: 'MEMBER',
      });
      databaseBuilder.factory.buildMembership({
        organizationId: organization3.id,
        userId: user.id,
        organizationRole: 'ADMIN',
      });

      await databaseBuilder.commit();

      // when
      const userOrganizations = await userOrganizationsForAdminRepository.findByUserId(user.id);

      // then
      expect(userOrganizations).to.be.an('array').to.have.lengthOf(3);

      expect(userOrganizations[0]).to.have.property('disabledAt').not.null;

      expect(userOrganizations[1]).to.have.property('disabledAt').null;
      expect(userOrganizations[1]).to.have.property('role', 'MEMBER');

      expect(userOrganizations[2]).to.have.property('disabledAt').null;
      expect(userOrganizations[2]).to.have.property('role', 'ADMIN');
    });
  });
});
