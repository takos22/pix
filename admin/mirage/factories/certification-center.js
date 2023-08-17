import { faker } from '@faker-js/faker';
import { Factory } from 'miragejs';

export default Factory.extend({
  name() {
    return faker.company.name();
  },

  type() {
    return 'SUP';
  },
});
