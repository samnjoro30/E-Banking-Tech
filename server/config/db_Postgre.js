const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("../schema/index.js");
require("dotenv").config();

let db;

if (process.env.NEON_DATABASE_URL) {
  // Neon serverless (production)
  const { neon } = require("@neondatabase/serverless");
  const { drizzle: neonDrizzle } = require("drizzle-orm/neon-serverless");

  const sql = neon(process.env.NEON_DATABASE_URL);
  db = neonDrizzle(sql, { schema });

  console.log("✅ Connected to Neon Postgres");
} else {
  // Local / traditional Postgres
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
  });

  db = drizzle(pool, { schema });
  console.log("✅ Connected to local Postgres");
}

db.testConnection = async () => {
  try {
    if (process.env.NEON_DATABASE_URL) {
      await db.execute("SELECT 1");
    } else {
      const client = await pool.connect();
      const result = await client.query("SELECT 1");
      client.release();
    }
    console.log('✅ PostgreSQL connection test successful');
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection test failed:', error.message);
    return false;
  }
};


module.exports = db;
