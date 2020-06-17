import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { run } from '@ember/runloop';

module('Unit | Model | student', function(hooks) {

  setupTest(hooks);
  module('#authenticationMethods', function() {

    module('when not reconciled', function() {
      test('it should return dash', function(assert) {
        // given
        const dash = '\u2013';
        const store = this.owner.lookup('service:store');
        const student = { lastName: 'Last', firstName: 'First', birthdate: '2010-10-10' };
        const model = run(() => store.createRecord('student', student));

        // when
        // then
        assert.equal(model.authenticationMethods, dash);
      });
    });

    module('when reconciled', function() {

      module('single authentication method', function() {
        test('it should return Identifiant when identified by username', function(assert) {
          // given
          const store = this.owner.lookup('service:store');
          const student = {
            lastName: 'Carter',
            firstName: 'Blue Ivy',
            birthdate: '2012-01-07',
            username: 'blueivy.carter0701',
          };
          const model = run(() => store.createRecord('student', student));

          // when
          // then
          assert.equal(model.authenticationMethods, 'Identifiant');
        });
        test('it should return Adresse e-mail when identified by email', function(assert) {
          // given
          const store = this.owner.lookup('service:store');
          const student = {
            lastName: 'De Cambridge',
            firstName: 'George',
            birthdate: '2013-07-22',
            email: 'georges.decambridge@example.net'
          };
          const model = run(() => store.createRecord('student', student));

          // when
          // then
          assert.equal(model.authenticationMethods, 'Adresse e-mail');
        });
        test('it should return Mediacentre when identified from GAR', function(assert) {
          // given
          const store = this.owner.lookup('service:store');
          const student = {
            lastName: 'De Cambridge',
            firstName: 'George',
            birthdate: '2013-07-22',
            isAuthenticatedFromGar: true
          };
          const model = run(() => store.createRecord('student', student));

          // when
          // then
          assert.equal(model.authenticationMethods, 'Mediacentre');
        });
      });

      module('multiple authentication method', function() {

        test('it should return 2 aggregated methods, excluding GAR', function(assert) {
          // given
          const SPACING_CHARACTER = '\n';
          const store = this.owner.lookup('service:store');
          const student = {
            lastName: 'Carter',
            firstName: 'Blue Ivy',
            birthdate: '2012-01-07',
            username: 'blueivy.carter0701',
            email: 'carter.blueivy@example.net',
            isAuthenticatedFromGar: false,
          };
          const model = run(() => store.createRecord('student', student));

          // when
          // then
          assert.equal(model.authenticationMethods, 'Adresse e-mail' + SPACING_CHARACTER + 'Identifiant');
        });
      });

    });
  });

});
