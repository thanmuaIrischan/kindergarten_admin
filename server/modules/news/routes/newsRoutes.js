const express = require('express');
const router = express.Router();
const newsController = require('../controller/newsController');
const chatController = require('../controller/chatController');

// Get all news
router.get('/', newsController.getAllNews);

// Get single news item
router.get('/:id', newsController.getNewsById);

// Create news
router.post('/', newsController.createNews);

// Update news
router.put('/:id', newsController.updateNews);

// Delete news
router.delete('/:id', newsController.deleteNews);

// Chat endpoint
router.post('/chat', chatController.generateResponse);

module.exports = router; 