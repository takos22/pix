import { config } from '../config.js';
import { promises } from 'dns';

const { Resolver } = promises;
const { mailing } = config;

const checkDomainIsValid = function (address) {
  if (!mailing.enabled) {
    return Promise.resolve(true);
  }

  const domain = address.replace(/.*@/g, '');
  return Resolver.resolveMx(domain).then(() => true);
};

export { checkDomainIsValid };
