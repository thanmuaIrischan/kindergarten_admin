const express = require('express');
const router = express.Router();
const semesterController = require('../controller/semester.controller');

// Import semesters (must be before /:id routes)
router.post('/import', semesterController.importSemesters);

// Get all semesters
router.get('/', semesterController.getAllSemesters);

// Get semester by ID
router.get('/:id', semesterController.getSemesterById);

// Create new semester
router.post('/', semesterController.createSemester);

// Update semester
router.put('/:id', semesterController.updateSemester);

// Delete semester
router.delete('/:id', semesterController.deleteSemester);

module.exports = router; 