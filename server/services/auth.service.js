const bcrypt = require('bcrypt');
const logger = require('../config/logger');

const hashPassword = async password => {
  try {
    return await bcrypt.hash(password, 12);
  } catch (err) {
    logger.error('Password hashing error:', err);
    throw new Error('Password hashing failed');
  }
};
const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (err) {
    logger.error('Password comparison error:', err);
    throw new Error('Password comparison failed');
  }
};

module.exports = { hashPassword, comparePassword };
