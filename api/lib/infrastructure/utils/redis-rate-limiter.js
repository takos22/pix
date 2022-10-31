const redis = require('redis');
const logger = require('../logger');
const settings = require('../../config');
const redisRateLimiter = settings.rateLimit.redisUrl ? buildRedisRateLimiter() : null;

function buildRedisRateLimiter() {
  const rateLimiter = redis.createClient(settings.rateLimit.redisUrl);
  rateLimiter.connect();
  rateLimiter.scriptAsync = rateLimiter.scriptLoad.bind(rateLimiter);
  rateLimiter.evalshaAsync = rateLimiter.evalSha.bind(rateLimiter);
  rateLimiter.on('error', (err) => logger.warn({ redisClient: 'rate-limit', err }, 'Error encountered'));
  return rateLimiter;
}

module.exports = redisRateLimiter;
