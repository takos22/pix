import Model, { attr } from '@ember-data/model';

export default class UserSetting extends Model {
  // attributes
  @attr('date') updatedAt;
  @attr('string') color;
}
