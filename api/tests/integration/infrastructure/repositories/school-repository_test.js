import { catchErr, databaseBuilder, expect, knex } from '../../../test-helper.js';
import * as schoolRepository from '../../../../src/school/infrastructure/repositories/school-repository.js';
import { School } from '../../../../src/school/domain/models/School.js';
import { NotFoundError } from '../../../../lib/domain/errors.js';

describe('Integration | Repository | School', function () {
  describe('#save', function () {
    afterEach(async function () {
      await knex('schools').delete();
    });

    it('saves the given organization', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO-1D' });
      await databaseBuilder.commit();

      // when
      const result = await schoolRepository.save({ organizationId: organization.id, code: 'HAPPYY123' });

      // then
      expect(result).to.equal('HAPPYY123');
    });
  });
  describe('#getByCode', function () {
    afterEach(async function () {
      await knex('schools').delete();
    });

    it('returns the organization corresponding to the code', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO-1D', name: 'École des fans' });
      databaseBuilder.factory.buildSchool({ organizationId: organization.id, code: 'HAPPYY123' });
      await databaseBuilder.commit();

      const expectedSchool = new School({ name: 'École des fans', id: organization.id, code: 'HAPPYY123' });
      // when
      const result = await schoolRepository.getByCode('HAPPYY123');

      // then
      expect(result).to.deep.equal(expectedSchool);
    });

    it('throws a NotFoundError if code does not exist', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization({ type: 'SCO-1D', name: 'École des fans' });
      databaseBuilder.factory.buildSchool({ organizationId: organization.id, code: 'HAPPYY123' });
      await databaseBuilder.commit();

      // when
      const error = await catchErr(schoolRepository.getByCode)('NOTHAPPY');

      // then
      expect(error).to.be.an.instanceof(NotFoundError);
      expect(error.message).to.equal('No school found for code NOTHAPPY');
    });
  });

  describe('#isCodeAvailable', function () {
    beforeEach(async function () {
      databaseBuilder.factory.buildSchool({ code: 'BADOIT710' });
      await databaseBuilder.commit();
    });

    it('should resolve true if the code is available', async function () {
      // when
      const isCodeAvailable = await schoolRepository.isCodeAvailable('FRANCE998');

      // then
      expect(isCodeAvailable).to.be.true;
    });

    it('should resolve false if the code is not available', async function () {
      // when
      const isCodeAvailable = await schoolRepository.isCodeAvailable('BADOIT710');

      // then
      expect(isCodeAvailable).to.be.false;
    });
  });
});
