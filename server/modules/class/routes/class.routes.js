const express = require('express');
const router = express.Router();
const classController = require('../controller/class.controller');

// Get all classes
router.get('/', classController.getAllClasses);

// Get class by ID
router.get('/:id', classController.getClassById);

// Create new class
router.post('/', classController.createClass);

// Update class
router.put('/:id', classController.updateClass);

// Update class teacher
router.patch('/:id/teacher', classController.updateClassTeacher);

// Delete class
router.delete('/:id', classController.deleteClass);

// Import classes
router.post('/import', classController.importClasses);

module.exports = router; 