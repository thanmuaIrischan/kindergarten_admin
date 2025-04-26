const express = require('express');
const router = express.Router();
const newsController = require('../controller/newsController');

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

module.exports = router; 