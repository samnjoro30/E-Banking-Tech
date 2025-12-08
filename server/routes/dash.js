// In routes/dash.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getDashboardData } = require('../controllers/dashboard'); // This should work if dashboard.js exists

router.get('/profile', authMiddleware, getDashboardData);

module.exports = router;