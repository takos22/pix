import { describe, it } from 'mocha';
import { expect } from 'chai';
import { setupApplicationTest } from 'ember-mocha';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { find, findAll, click } from '@ember/test-helpers';
import { visit } from '@1024pix/ember-testing-library';
import { authenticateByEmail } from '../../helpers/authentication';

describe('Acceptance | User-tutorials-v2 | Saved', function () {
  setupApplicationTest();
  setupMirage();
  let user;

  beforeEach(async function () {
    const numberOfTutorials = 100;
    user = server.create('user', 'withEmail');
    server.create('feature-toggle', { id: 0, isPixAppTutoFiltersEnabled: true });
    await authenticateByEmail(user);
    await server.db.tutorials.remove();
    server.createList('tutorial', numberOfTutorials, 'withUserTutorial');
  });

  describe('When there are tutorials saved', function () {
    it('should display paginated tutorial cards', async function () {
      await visit('/mes-tutos/enregistres');
      expect(findAll('.tutorial-card-v2')).to.exist;
      expect(findAll('.tutorial-card-v2')).to.be.lengthOf(10);
      expect(find('.pix-pagination__navigation').textContent).to.contain('Page 1 / 10');
    });

    describe('when user clicking save again', function () {
      it('should remove tutorial ', async function () {
        // given
        const numberOfTutorials = 10;
        await server.db.tutorials.remove();
        await server.db.userTutorials.remove();
        server.createList('tutorial', numberOfTutorials, 'withUserTutorial');
        await visit('/mes-tutos/enregistres');

        // when
        await click('[aria-label="Retirer de ma liste de tutos"]');

        // then
        expect(findAll('.tutorial-card-v2')).to.be.lengthOf(9);
      });
    });
  });

  describe('when filter button is clicked', function () {
    it('should open sidebar', async function () {
      // given
      const screen = await visit('/mes-tutos/enregistres');

      // when
      await click(screen.getByRole('button', { name: 'Filtrer' }));

      // then
      expect(find('.pix-sidebar')).to.exist;
      expect(find('.pix-sidebar__overlay')).to.exist;
      expect(find('.pix-sidebar__overlay--hidden')).to.not.exist;
      expect(find('.pix-sidebar--hidden')).to.not.exist;
    });
  });

  describe('when sidebar is open', function () {
    describe('when close button is clicked', function () {
      it('should close sidebar', async function () {
        // given
        const screen = await visit('/mes-tutos/enregistres');
        await click(screen.getByRole('button', { name: 'Filtrer' }));

        // when
        await click(find('[aria-label="Fermer"]'));

        // then
        expect(find('.pix-sidebar__overlay--hidden')).to.exist;
        expect(find('.pix-sidebar--hidden')).to.exist;
      });
    });
  });
});
