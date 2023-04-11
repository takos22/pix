import { promises } from 'node:dns';

const { Resolver } = promises;

import { mailing } from '../config.js';

const checkDomainIsValid = function (address) {
  if (!mailing.enabled) {
    return Promise.resolve(true);
  }

  const domain = address.replace(/.*@/g, '');
  return Resolver.resolveMx(domain).then(() => true);
};

export { checkDomainIsValid };
