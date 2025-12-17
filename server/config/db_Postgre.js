const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const schema = require('../schema/index.js');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const db = drizzle(pool, { schema });

// Alternative for Neon serverless
let neonDb;
if (process.env.NEON_DATABASE_URL) {
  const { neon } = require('@neondatabase/serverless');
  const { drizzle: neonDrizzle } = require('drizzle-orm/neon-serverless');
  
  const getNeonDb = () => {
    const sql = neon(process.env.NEON_DATABASE_URL);
    return neonDrizzle(sql, { schema });
  };
  
  module.exports.getNeonDb = getNeonDb;
}

module.exports = { db };