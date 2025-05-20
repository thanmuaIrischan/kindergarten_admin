const express = require('express');
const router = express.Router();
const newsRoutes = require('./routes/newsRoutes');

// Use news routes
router.use('/', newsRoutes);

module.exports = router; 