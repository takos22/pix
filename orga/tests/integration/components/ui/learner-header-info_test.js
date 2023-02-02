import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | Ui::LearnerHeaderInfo', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it renders learner header informations when there is a group', async function (assert) {
    const connectionMethods = 'email';
    const groupName = 'Groupe';
    const group = '3E';

    this.set('groupName', groupName);
    this.set('group', group);
    this.set('connectionMethods', connectionMethods);

    await render(
      hbs`<Ui::LearnerHeaderInfo @group={{this.group}} @groupName={{this.groupName}} @connectionMethods={{this.connectionMethods}} />`
    );

    assert.contains('3E');
    assert.contains('email');
    assert.contains('Groupe');
  });

  test('it does not render learner division header informations when there is no group', async function (assert) {
    const connectionMethods = 'email';
    const group = '3E';

    this.set('group', group);
    this.set('connectionMethods', connectionMethods);

    await render(hbs`<Ui::LearnerHeaderInfo @group={{this.group}} @connectionMethods={{this.connectionMethods}} />`);

    assert.notContains('3E');
    assert.contains('email');
  });
});
