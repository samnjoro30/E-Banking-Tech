const express = require('express');
const router = express();
const {
  LoginAdmin,
  RegisterAdmin,
} = require('../controllers/adminRegister');

router.post('/admin/login', LoginAdmin);
router.post('/admin/register', RegisterAdmin);

module.exports = router;
