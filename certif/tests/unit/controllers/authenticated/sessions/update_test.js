import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | authenticated/sessions/update', function (hooks) {
  setupTest(hooks);

  module('#action updateSession', function (hooks) {
    let controller;
    let event;
    const sessionId = 'sessionId';
    const session = { id: sessionId };

    hooks.beforeEach(function () {
      controller = this.owner.lookup('controller:authenticated/sessions/update');
      event = { preventDefault: sinon.stub() };
      sinon.stub(controller.router, 'transitionTo');
      sinon.stub(controller, 'checkMissingSessionFields');
      session.save = sinon.stub().resolves();
      controller.model = session;
    });

    test('it should call preventDefault on event passed in action', async function (assert) {
      // when
      await controller.send('updateSession', event);

      // then
      assert.ok(event.preventDefault.calledOnce);
    });

    test('it should call save on the session model', async function (assert) {
      // when
      await controller.send('updateSession', event);

      // then
      assert.ok(session.save.calledOnce);
    });

    test('it should transition to correct route with the session id', async function (assert) {
      // when
      await controller.send('updateSession', event);

      // then
      assert.ok(controller.router.transitionTo.calledWith('authenticated.sessions.details', sessionId));
    });
  });

  module('#action cancel', function (hooks) {
    let controller;
    const sessionId = 'sessionId';
    const session = { id: sessionId };

    hooks.beforeEach(function () {
      controller = this.owner.lookup('controller:authenticated/sessions/update');
      sinon.stub(controller.router, 'transitionTo');
      controller.model = session;
    });

    test('it should transition to correct cancel route with the session id', async function (assert) {
      // when
      await controller.send('cancel');

      // then
      assert.ok(controller.router.transitionTo.calledWith('authenticated.sessions.details', sessionId));
    });
  });

  module('#action onDatePicked', function (hooks) {
    let controller;
    const session = { date: '' };

    hooks.beforeEach(function () {
      controller = this.owner.lookup('controller:authenticated/sessions/update');
      controller.model = session;
    });

    test('it should update session date field with lastSelectedDateFormatted', function (assert) {
      // when
      const lastSelectedDateFormatted = 'lastSelectedDateFormatted';
      controller.send('onDatePicked', 'ignoredParam', lastSelectedDateFormatted);

      // then
      assert.strictEqual(session.date, lastSelectedDateFormatted);
    });
  });

  module('#action onTimePicked', function (hooks) {
    let controller;
    const session = { time: '' };

    hooks.beforeEach(function () {
      controller = this.owner.lookup('controller:authenticated/sessions/update');
      controller.model = session;
    });

    test('it should update session time field with lastSelectedTimeFormatted', function (assert) {
      // when
      const lastSelectedTimeFormatted = 'lastSelectedTimeFormatted';
      controller.send('onTimePicked', 'ignoredParam', lastSelectedTimeFormatted);

      // then
      assert.strictEqual(session.time, lastSelectedTimeFormatted);
    });
  });
});
