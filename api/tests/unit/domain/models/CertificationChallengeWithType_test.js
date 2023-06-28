import { expect, domainBuilder } from '../../../test-helper.js';
import { CertificationChallengeWithType } from '../../../../lib/shared/domain/models/CertificationChallengeWithType.js';
import { Type } from '../../../../lib/shared/domain/models/Challenge.js';

describe('Unit | Domain | Models | CertificationChallengeWithType', function () {
  describe('#constructor', function () {
    // TODO: Fix this the next time the file is edited.
    // eslint-disable-next-line mocha/no-setup-in-describe
    const validTypes = Object.values(Type);
    // eslint-disable-next-line mocha/no-setup-in-describe
    validTypes.forEach((validType) => {
      it(`should initialize CertificationChallengeWithType with type ${validType}`, function () {
        // when
        const certificationChallengeWithType = new CertificationChallengeWithType({ type: validType });

        // then
        expect(certificationChallengeWithType.type).to.equal(validType);
      });
    });

    it('should initialize type to EmptyType when type is not valid', function () {
      // when
      const certificationChallengeWithType = new CertificationChallengeWithType({ type: 'COUCOUCOUCOCUCUO' });

      // then
      expect(certificationChallengeWithType.type).to.equal('EmptyType');
    });
  });

  describe('#neutralize', function () {
    it('should neutralize a non neutralized certification challenge', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        isNeutralized: false,
      });

      // when
      certificationChallengeWithType.neutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.true;
    });

    it('should leave a neutralized certification challenge if it was neutralized already', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({ isNeutralized: true });

      // when
      certificationChallengeWithType.neutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.true;
    });
  });

  describe('#deneutralize', function () {
    it('should deneutralize a neutralized certification challenge', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({ isNeutralized: true });

      // when
      certificationChallengeWithType.deneutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.false;
    });

    it('should leave a deneutralized certification challenge if it was deneutralized already', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        isNeutralized: false,
      });

      // when
      certificationChallengeWithType.deneutralize();

      // then
      expect(certificationChallengeWithType.isNeutralized).to.be.false;
    });
  });

  describe('#isPixPlus', function () {
    it('return true when challenge was picked for a pix plus certification', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        certifiableBadgeKey: 'someValue',
      });

      // when
      const isPixPlus = certificationChallengeWithType.isPixPlus();

      // then
      expect(isPixPlus).to.be.true;
    });

    it('return false when challenge was picked for a regular pix certification', function () {
      // given
      const certificationChallengeWithType = domainBuilder.buildCertificationChallengeWithType({
        certifiableBadgeKey: null,
      });

      // when
      const isPixPlus = certificationChallengeWithType.isPixPlus();

      // then
      expect(isPixPlus).to.be.false;
    });
  });
});
