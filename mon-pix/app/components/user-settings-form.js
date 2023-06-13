import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

export default class UserSettingsFormComponent extends Component {
  get options() {
    return [
      {
        label: 'Label Pouet',
        value: 'Pouet',
      },
      {
        label: 'Label Pouet',
        value: 'Pouet',
      },
      {
        label: 'Label Pouet',
        value: 'Pouet',
      },
    ];
  }
}
