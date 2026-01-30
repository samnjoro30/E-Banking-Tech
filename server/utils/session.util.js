const session = require('express-session');
const { RedisStore } = require('connect-redis');
const { redis } = require('./redis/redis.util');

const isProd = process.env.NODE_ENV === 'production';

function sessionMiddleware() {
  return session({
    store: new RedisStore({
      client: redis.session,
      prefix: 'sess:',
    }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    },
  });
}

module.exports = sessionMiddleware;
