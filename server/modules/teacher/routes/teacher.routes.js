const express = require('express');
const router = express.Router();
const {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher,
    searchTeachers,
    importTeachers,
    getPrintData
} = require('../controller/teacher.controller');

// Import teachers (must be before /:id routes)
router.post('/import', importTeachers);

// Get print data
router.get('/print', getPrintData);

// Get all teachers
router.get('/', getAllTeachers);

// Search teachers
router.get('/search', searchTeachers);

// Get teacher by ID
router.get('/:id', getTeacherById);

// Create new teacher
router.post('/', createTeacher);

// Update teacher
router.put('/:id', updateTeacher);

// Delete teacher
router.delete('/:id', deleteTeacher);

module.exports = router; 