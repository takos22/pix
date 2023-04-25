'use strict';
module.exports = function findCountries({ countryRepository }) {
  return countryRepository.findAll();
};
