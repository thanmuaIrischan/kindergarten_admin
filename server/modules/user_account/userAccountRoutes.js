const express = require('express');
const router = express.Router();
const userAccountController = require('./userAccountController');

// Get all accounts
router.get('/', userAccountController.getAllAccounts);

// Get account by ID
router.get('/:id', userAccountController.getAccountById);

// Create new account
router.post('/', userAccountController.createAccount);

// Update account
router.put('/:id', userAccountController.updateAccount);

// Delete account
router.delete('/:id', userAccountController.deleteAccount);

module.exports = router; 