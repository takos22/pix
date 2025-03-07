import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

const DEFAULT_PAGE_NUMBER = 1;

export default class ListController extends Controller {
  queryParams = ['pageNumber', 'pageSize', 'id', 'firstName', 'lastName', 'email', 'username'];

  @tracked pageNumber = DEFAULT_PAGE_NUMBER;
  @tracked pageSize = 10;
  @tracked id = null;
  @tracked firstName = null;
  @tracked lastName = null;
  @tracked email = null;
  @tracked username = null;

  @tracked idForm = null;
  @tracked firstNameForm = null;
  @tracked lastNameForm = null;
  @tracked emailForm = null;
  @tracked usernameForm = null;

  @action
  async refreshModel(event) {
    event.preventDefault();
    this.id = this.idForm;
    this.firstName = this.firstNameForm;
    this.lastName = this.lastNameForm;
    this.email = this.emailForm;
    this.username = this.usernameForm;
    this.pageNumber = DEFAULT_PAGE_NUMBER;
  }

  @action
  onChangeUserId(event) {
    this.idForm = event.target.value;
  }

  @action
  onChangeFirstName(event) {
    this.firstNameForm = event.target.value;
  }

  @action
  onChangeLastName(event) {
    this.lastNameForm = event.target.value;
  }

  @action
  onChangeEmail(event) {
    this.emailForm = event.target.value;
  }

  @action
  onChangeUsername(event) {
    this.usernameForm = event.target.value;
  }

  @action
  clearSearchFields() {
    this.id = null;
    this.firstName = null;
    this.lastName = null;
    this.email = null;
    this.username = null;

    this.idForm = null;
    this.firstNameForm = null;
    this.lastNameForm = null;
    this.emailForm = null;
    this.usernameForm = null;
  }
}
