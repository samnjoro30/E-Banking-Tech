const express = require('express');
const { createAccount } = require('../controllers/Account');
const authMiddleware = require('../middlewares/authMiddleware');
const idempotencyMiddleware = require('../middlewares/idemtotecyMiddleware');
const { verifyCsrf } = require('../utils/csrf');

const router = express();

router.post(
  '/personal-account',
  verifyCsrf,
  idempotencyMiddleware,
  authMiddleware,
  createAccount
);

module.exports = router;
