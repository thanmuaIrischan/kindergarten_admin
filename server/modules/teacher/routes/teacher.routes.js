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
    getPrintData,
    getTeacherByTeacherId
} = require('../controller/teacher.controller');
const TeacherRepository = require('../repositories/teacher.repository');

// Import teachers
router.post('/import', importTeachers);

// Get print data
router.get('/print', getPrintData);

// Search teachers
router.get('/search', searchTeachers);

// Get teacher by teacherID - must come before /:id route
router.get('/by-teacher-id/:teacherID', getTeacherByTeacherId);

// Get all teachers
router.get('/', getAllTeachers);

// Get teacher by ID
router.get('/:id', getTeacherById);

// Create new teacher
router.post('/', createTeacher);

// Update teacher
router.put('/:id', updateTeacher);

// Delete teacher
router.delete('/:id', deleteTeacher);

// Test route to check teacher existence
router.get('/check/:teacherID', async (req, res) => {
    try {
        const teacherRepo = new TeacherRepository();
        const exists = await teacherRepo.findByTeacherId(req.params.teacherID);
        res.json({
            exists: !!exists,
            teacherID: req.params.teacherID,
            teacher: exists
        });
    } catch (error) {
        res.status(500).json({
            error: error.message,
            teacherID: req.params.teacherID
        });
    }
});

module.exports = router; 