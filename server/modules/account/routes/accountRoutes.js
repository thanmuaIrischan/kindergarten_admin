const express = require('express');
const router = express.Router();
const accountController = require('../controller/accountController');

// Error handling wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// Authenticate user
router.post('/authenticate', asyncHandler(accountController.authenticate));

// Get account by ID
router.get('/:id', asyncHandler(accountController.getAccountById));

// Send verification code
router.post('/send-verification-code', asyncHandler(accountController.sendVerificationCode));

// Verify code
router.post('/verify-code', asyncHandler(accountController.verifyCode));

// Reset password
router.post('/reset-password', asyncHandler(accountController.resetPassword));

module.exports = router; 