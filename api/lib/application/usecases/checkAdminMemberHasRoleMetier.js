import * as adminMemberRepository from '../../infrastructure/repositories/admin-member-repository.js';

const execute = async function (userId) {
  const adminMember = await adminMemberRepository.get({ userId });
  return adminMember.isMetier;
};

export { execute };
