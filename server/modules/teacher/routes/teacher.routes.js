const express = require('express');
const router = express.Router();
const TeacherController = require('../controllers/teacher.controller');

// Get all teachers
router.get('/', TeacherController.getAllTeachers);

// Search teachers
router.get('/search', TeacherController.searchTeachers);

// Get teacher by ID
router.get('/:id', TeacherController.getTeacherById);

// Create new teacher
router.post('/', TeacherController.createTeacher);

// Update teacher
router.put('/:id', TeacherController.updateTeacher);

// Delete teacher
router.delete('/:id', TeacherController.deleteTeacher);

module.exports = router; 