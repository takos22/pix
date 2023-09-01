import { expect } from '../../../../../test-helper.js';
import { serialize } from '../../../../../../src/devcomp/infrastructure/serializers/json-api/grain-serializer.js';
import { Grain } from '../../../../../../src/devcomp/domain/models/Grain.js';

describe('Devcomp | Unit | Infrastructure | Serializers | Jsonapi | GrainSerializer', function () {
  describe('#serialize', function () {
    it('should return a serialized grain', function () {
      const grain = new Grain({
        id: '1',
        title: 'Grain title',
        description: 'Grain description',
      });

      const serializedGrain = serialize(grain);

      expect(serializedGrain).to.deep.equal({
        data: {
          attributes: {
            description: 'Grain description',
            title: 'Grain title',
          },
          id: '1',
          type: 'grains',
        },
      });
    });
  });
});
