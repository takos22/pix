import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component |  user-settings-form', function (hooks) {
  setupIntlRenderingTest(hooks);

  test.only('it should display colour selector', async function (assert) {
    // given
    this.set("userSettings", {color: "red"})

    //  when
    const screen = await render(hbs`<UserSettingsForm @userSettings={this.userSettings}/>`);

    // then
    assert.dom(screen.getByLabelText('Couleur favorite')).exists();
  });
});
