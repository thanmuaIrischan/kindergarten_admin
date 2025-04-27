const express = require('express');
const router = express.Router();
const twilioController = require('../controller/twilioController');

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Search for available phone numbers
router.post('/search-numbers', asyncHandler(twilioController.searchNumbers));

// Purchase a phone number
router.post('/purchase-number', asyncHandler(twilioController.purchaseNumber));

// Get all purchased numbers
router.get('/numbers', asyncHandler(twilioController.getPurchasedNumbers));

module.exports = router; 