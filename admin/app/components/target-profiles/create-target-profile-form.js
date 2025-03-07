import { action } from '@ember/object';
import Component from '@glimmer/component';
import { service } from '@ember/service';
import { optionsCategoryList } from '../../models/target-profile';
import { tracked } from '@glimmer/tracking';

export default class CreateTargetProfileForm extends Component {
  @service notifications;

  @tracked submitting = false;
  selectedTubes = [];

  constructor() {
    super(...arguments);
    this.optionsList = optionsCategoryList;
  }

  @action
  updateTubes(tubesWithLevel) {
    this.selectedTubes = tubesWithLevel.map(({ id, level }) => ({
      id,
      level,
    }));
  }

  @action
  updateTargetProfileValue(key, event) {
    this.args.targetProfile[key] = event.target.value;
  }

  @action
  updateCategory(value) {
    this.args.targetProfile['category'] = value;
  }

  @action
  async onSubmit(event) {
    try {
      this.submitting = true;
      await this.args.onSubmit(event, this.selectedTubes);
    } finally {
      this.submitting = false;
    }
  }

  // on a une explication rationnelle
  noop() {}
}
