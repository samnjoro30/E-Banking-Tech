require('dotenv').config();

module.exports = {
  schema: './schema/index.js',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};
