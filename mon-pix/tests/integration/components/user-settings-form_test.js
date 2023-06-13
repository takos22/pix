import { module, test } from 'qunit';
import { hbs } from 'ember-cli-htmlbars';
import { render } from '@1024pix/ember-testing-library';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | user settings form', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('Rendering', function () {
    test('it should display a color selector', async function (assert) {
      // given
      this.set('userSettings', { color: 'red' });

      // when
      const screen = await render(hbs`<UserSettingsForm @userSettings={this.userSettings}/>`);

      // then
      assert.dom(screen.getByLabelText('Couleur favorite')).exists();
    });

    test('should display a submit button to save the user settings', async function (assert) {
      // given
      this.set('userSettings', { color: 'red' });

      // when
      const screen = await render(hbs`<UserSettingsForm @userSettings={this.userSettings}/>`);

      // then
      assert.dom(screen.getByRole('button', { name: 'Sauvegarder' })).exists();
    });
  });
});
