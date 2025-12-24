const mongoose = require('mongoose');
const { db } = require('../config/db_Postgre');

const checkMongo = () => {
  return mongoose.connection.readyState === 1;
};

const checkPostgres = async () => {
  try {
    await db.execute('select 1');
    return true;
  } catch (err) {
    console.error('PostgreSQL health check failed:', err);
    return false;
  }
};

module.exports = {
  checkMongo,
  checkPostgres,
};
