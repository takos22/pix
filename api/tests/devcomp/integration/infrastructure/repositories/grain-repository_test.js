import { catchErr, expect } from '../../../../test-helper.js';
import { getById } from '../../../../../src/devcomp/infrastructure/repositories/grain-repository.js';
import { Grain } from '../../../../../src/devcomp/domain/models/Grain.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';

describe('Devcomp | Integration | Repositories | Grain Repository', function () {
  describe('#getById', function () {
    context('when grain exists', function () {
      it('should return grain', async function () {
        const result = await getById({ id: 1 });

        expect(result).to.be.instanceOf(Grain);
        expect(result.id).to.equal(1);
      });
    });

    context('when grain does not exist', function () {
      it('should throw an error', async function () {
        const error = await catchErr(getById)({ id: 999 });

        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
