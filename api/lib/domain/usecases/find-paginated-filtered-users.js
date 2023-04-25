'use strict';
module.exports = function findPaginatedFilteredUsers({ filter, page, userRepository }) {
  return userRepository.findPaginatedFiltered({ filter, page });
};
