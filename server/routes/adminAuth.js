const express = require('express')
const router = express.router();
const { LoginAdmin, RegisterAdmin, AdminVerifcation } = require('../controllers/adminRegister');

router.post('/admin/login', LoginAdmin);

module.exports = router;