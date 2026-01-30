const { createClient } = require('redis');
require('dotenv').config();

function createRedisClient(name, url, options = {}) {
  const client = createClient({
    url,
    socket: options.tls ? { tls: true, rejectUnauthorized: false } : undefined,
  });

  client.on('connect', () => {
    console.log(`✅ Redis (${name}) connected`);
  });

  client.on('error', err => {
    console.error(`❌ Redis (${name}) error`, err);
  });

  return client;
}

const isProd = process.env.NODE_ENV === 'production';

const redis = {
  session: createRedisClient(
    'session',
    process.env.REDIS_SESSION_URL || process.env.REDIS_URL,
    { tls: isProd }
  ),
  rateLimit: createRedisClient(
    'rate-limit',
    process.env.REDIS_RL_URL || process.env.REDIS_URL,
    { tls: isProd }
  ),
  queue: createRedisClient(
    'queue',
    process.env.REDIS_QUEUE_URL || process.env.REDIS_URL,
    { tls: isProd }
  ),
};

async function connectAllRedis() {
  for (const [name, client] of Object.entries(redis)) {
    if (!client.isOpen) {
      console.log(`🔌 Connecting Redis (${name})...`);
      await client.connect();
    }
  }
}

module.exports = { redis, connectAllRedis };
