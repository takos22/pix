const createPasswordResetDemand = async function ({
  email,
  locale,
  mailService,
  resetPasswordService,
  resetPasswordDemandRepository,
  userRepository,
}) {
  await userRepository.isUserExistingByEmail(email);

  const temporaryKey = resetPasswordService.generateTemporaryKey();
  const passwordResetDemand = await resetPasswordDemandRepository.create({ email, temporaryKey });

  await mailService.sendResetPasswordDemandEmail({ email, locale, temporaryKey });

  return passwordResetDemand;
};

export { createPasswordResetDemand };
