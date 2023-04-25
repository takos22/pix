'use strict';
const { promisify } = require('util');
const dns = require('dns');
const resolveMx = promisify(dns.resolveMx);

module.exports = {
  checkDomainIsValid(emailAddress) {
    const domain = emailAddress.replace(/.*@/g, '');
    return resolver.resolveMx(domain).then(() => true);
  },
};
