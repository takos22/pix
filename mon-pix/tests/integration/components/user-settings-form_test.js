import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component |  user-settings-form', function (hooks) {
  setupRenderingTest(hooks);

  test('replace this by your real test', async function (assert) {
    // given

    //  when
    await render(hbs`<UserSettingsForm />`);

    // then
    assert.strictEqual(true, true);
  });
});
