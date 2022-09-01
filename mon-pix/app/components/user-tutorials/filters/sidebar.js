import Component from '@glimmer/component';
import { action } from '@ember/object';

const INITIAL_FILTERS_STATE = { competences: [] };

export default class Sidebar extends Component {
  filters = INITIAL_FILTERS_STATE;

  get sortedAreas() {
    return this.args.areas.sortBy('code');
  }

  @action
  handleFilterChange(type, id, event) {
    if (event.target.checked) {
      this.filters[type].push(id);
    } else {
      this.filters[type] = this.filters[type].filter((item) => item !== id);
    }
  }

  @action
  handleResetFilters() {
    this.filters = INITIAL_FILTERS_STATE;
  }
}
