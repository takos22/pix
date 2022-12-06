module.exports = async function ({ id, organizationId, learnerRepository }) {
  return learnerRepository.get(id, organizationId);
};
