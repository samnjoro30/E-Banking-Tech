const { Pool } =  require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.SUPABASE_USER,
    host: process.env.SUPABASE_HOST,
    database: process.env.SUPABASE_DB,
    password: process.env.POSTGRE_PASS,
    ssl: {
        rejectUnauthorized: false 
      }
    });
    
module.exports = pool;