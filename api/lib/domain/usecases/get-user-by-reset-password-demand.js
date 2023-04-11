const getUserByResetPasswordDemand = async function ({
  temporaryKey,
  resetPasswordService,
  tokenService,
  userRepository,
}) {
  await tokenService.decodeIfValid(temporaryKey);
  const { email } = await resetPasswordService.verifyDemand(temporaryKey);
  return userRepository.getByEmail(email);
};

export { getUserByResetPasswordDemand };
