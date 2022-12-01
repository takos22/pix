import Model, {attr} from '@ember-data/model'

class UserSetting extends Model {
    @attr('string') color;
    @attr('date') createdAt;
    @attr('date') updatedAt;
};