import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';
import { setupTest } from 'ember-mocha';
import createGlimmerComponent from 'mon-pix/tests/helpers/create-glimmer-component';

describe('Unit | Component | Tutorial | card', function () {
  setupTest();

  let component;

  const training = {
    title: 'Mon super training',
    link: 'https://training.net/',
    type: 'webinaire',
    locale: 'fr-fr',
    duration: { hours: 6 },
  };

  beforeEach(function () {
    component = createGlimmerComponent('component:training/card', { training });
  });

  describe('#durationFormatted', function () {
    it('should have formatted duration', function () {
      // when
      const result = component.durationFormatted;

      // then
      expect(result).to.equal('6h');
    });
  });

  describe.only('#imageSrc', function () {
    it('should return appropriate image src for training type', function () {
      // when
      const result = component.imageSrc;

      // then
      expect(result).to.contain('Webinaire');
    });

    it('should return Parcours_Autoformation image for associated training type', function () {
      // given
      const training = {
        type: 'autoformation',
      };
      component = createGlimmerComponent('component:training/card', { training });

      // when
      const result = component.imageSrc;

      // then
      expect(result).to.contain('Parcours_Autoformation');
    });
  });
});
