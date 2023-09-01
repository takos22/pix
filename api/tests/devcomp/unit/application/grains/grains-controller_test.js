import { expect, sinon } from '../../../../test-helper.js';
import { grainsController } from '../../../../../src/devcomp/application/grains/grains-controller.js';

describe('Devcomp | Unit | Application | Grain | Grain Controller', function () {
  describe('#get', function () {
    it('should call getGrain use-case and return serialized grains', async function () {
      const serializedGrain = Symbol('serialized grains');
      const grain = Symbol('grains');
      const usecases = {
        getGrain: sinon.stub(),
      };
      usecases.getGrain.withArgs({ id: 1 }).returns(grain);
      const grainSerializer = {
        serialize: sinon.stub(),
      };
      grainSerializer.serialize.withArgs(grain).returns(serializedGrain);

      const result = await grainsController.get({ params: { id: 1 } }, null, { grainSerializer, usecases });

      expect(result).to.equal(serializedGrain);
    });
  });
});
