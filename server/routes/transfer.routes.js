const express = require('express');
const { transferController } = require('../controllers/transfer.controller');
const authMiddleware = require('../middlewares/authMiddleware');
const idempotencyMiddleware = require('../middlewares/idemtotecyMiddleware');
const router = express.Router();

router.post(
  '/transfer',
  authMiddleware,
  idempotencyMiddleware,
  transferController
);

module.exports = router;
