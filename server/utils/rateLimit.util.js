const rateLimit = require('express-rate-limit');
const { RedisStore } = require('rate-limit-redis');
const { redis } = require('./redis/redis.util');

function createRateLimiter({ windowMs, max, keyPrefix }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redis.rateLimit.sendCommand(args),
      prefix: keyPrefix,
    }),
  });
}

module.exports = { createRateLimiter };
