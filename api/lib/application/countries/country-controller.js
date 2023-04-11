import { usecases } from '../../domain/usecases/index.js';
import * as countrySerializer from '../../infrastructure/serializers/jsonapi/country-serializer.js';

const findCountries = async function () {
  const countries = await usecases.findCountries();
  return countrySerializer.serialize(countries);
};

export { findCountries };
