import Component from '@glimmer/component';

export default class UserSettingsFormComponent extends Component {
  get options() {
    return [
      {value: 'red', label: 'red'},
      {value: 'blue', label: 'blue'},
      {value: 'green', label: 'green'},
      {value: 'yellow', label: 'yellow'},
    ];
  }
}
