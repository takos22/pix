import { module, test } from 'qunit';
import sinon from 'sinon';
import { setupRenderingTest } from 'ember-qunit';
import { click } from '@ember/test-helpers';
import { render } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | Tables | header-sort', function (hooks) {
  setupRenderingTest(hooks);

  let onSortStub;

  hooks.beforeEach(function () {
    onSortStub = sinon.stub();
    this.set('onSort', onSortStub);
  });

  test('should display header title', async function (assert) {
    // when
    await render(hbs`<Table::HeaderSort>Header</Table::HeaderSort>`);

    // then
    assert.contains('Header');
  });

  module('When header sort is enabled', function () {
    test('should display sort-icon', async function (assert) {
      // when
      await render(hbs`<Table::HeaderSort @isDisabled={{false}}>Header</Table::HeaderSort>`);

      // then
      assert.dom('[data-icon="sort"]').exists();
    });

    test('it call onSort with "asc" when no order is given', async function (assert) {
      // when
      await render(
        hbs`<Table::HeaderSort
  @isDisabled={{false}}
  @order={{null}}
  @onSort={{this.onSort}}
  @ariaLabelDefaultSort='Trier par pertinence'
  @ariaLabelSortUp='Trié par ordre croissant'
  @ariaLabelSortDown='Trié par ordre décroissant'
>Header</Table::HeaderSort>`,
      );

      await click('[aria-label="Trier par pertinence"]');

      // then
      assert.ok(onSortStub.calledWith('asc'));
    });

    test('it call onSort with "asc" when order is "desc"', async function (assert) {
      // when
      await render(
        hbs`<Table::HeaderSort
  @isDisabled={{false}}
  @order='desc'
  @onSort={{this.onSort}}
  @ariaLabelDefaultSort='Trier par pertinence'
  @ariaLabelSortUp='Trié par ordre croissant'
  @ariaLabelSortDown='Trié par ordre décroissant'
>Header</Table::HeaderSort>`,
      );

      await click('[aria-label="Trié par ordre décroissant"]');

      // then
      assert.ok(onSortStub.calledWith('asc'));
    });

    test('it call onSort with "desc" when order is "asc"', async function (assert) {
      // when
      await render(
        hbs`<Table::HeaderSort
  @isDisabled={{false}}
  @onSort={{this.onSort}}
  @order='asc'
  @ariaLabelDefaultSort='Trier par pertinence'
  @ariaLabelSortUp='Trié par ordre croissant'
  @ariaLabelSortDown='Trié par ordre décroissant'
>Header</Table::HeaderSort>`,
      );

      await click('[aria-label="Trié par ordre croissant"]');

      // then
      assert.ok(onSortStub.calledWith('desc'));
    });
  });

  module('When header sort is disabled', function () {
    test('should not display arrow', async function (assert) {
      // when
      await render(
        hbs`<Table::HeaderSort @isDisabled={{true}} @ariaLabel='Trier par pertinence'>Header</Table::HeaderSort>`,
      );

      // then
      assert.dom('[aria-label="Trier par pertinence"]').doesNotExist();
    });
  });
});
