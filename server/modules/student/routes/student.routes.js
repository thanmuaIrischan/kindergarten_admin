const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controller/student.controller');
const { db } = require('../../../config/firebase');

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept Excel files
        if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.mimetype === 'application/vnd.ms-excel') {
            cb(null, true);
        } else {
            cb(new Error('Only Excel files are allowed!'), false);
        }
    }
});

// Export routes - must be before other routes
router.get('/export/:format', studentController.exportStudents);
router.post('/export/:format', studentController.exportStudents);

// Import route
router.post('/import', upload.single('file'), studentController.importStudents);

// File upload route
router.post('/upload', upload.single('file'), studentController.uploadFile);

// Test Firebase connection and data
router.get('/test-connection', async (req, res) => {
    try {
        console.log('Testing Firebase connection...');
        const studentRef = db.collection('student');
        console.log('Collection reference created');

        const snapshot = await studentRef.get();
        console.log('Snapshot retrieved:', {
            empty: snapshot.empty,
            size: snapshot.size
        });

        const students = [];
        snapshot.forEach(doc => {
            console.log('Document:', doc.id);
            console.log('Data:', doc.data());
            students.push({
                id: doc.id,
                ...doc.data()
            });
        });

        res.json({
            success: true,
            message: 'Firebase connection successful',
            count: snapshot.size,
            students: students
        });
    } catch (error) {
        console.error('Firebase connection test error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            stack: error.stack
        });
    }
});

// Test endpoint to add a sample student
router.post('/test', async (req, res) => {
    try {
        const testStudent = {
            studentProfile: {
                name: 'Nguyễn Văn Test',
                studentID: '2111011',
                gradeLevel: 3,
                gender: 'Male',
                school: 'Cơ sở 1',
                motherFullname: 'Nguyễn Thị Test',
                dateOfBirth: '01-05-2020',
                fatherFullname: 'Nguyễn Văn Parent',
                class: 'class_id_1',
                educationSystem: 'Chuẩn',
                fatherOccupation: 'Giáo viên',
                motherOccupation: 'Bác sĩ',
                parentContact: '0123456789'
            },
            studentDocument: {
                image: 'default_student_image',
                birthCertificate: 'linkanhgiaykhaisinh',
                householdRegistration: 'linkanhsohokhau'
            }
        };

        const docRef = await db.collection('student').add(testStudent);
        res.status(201).json({ id: docRef.id, ...testStudent });
    } catch (error) {
        console.error('Error adding test student:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all students
router.get('/', studentController.getAllStudents);

// Search students
router.get('/search', studentController.searchStudents);

// Get students by class
router.get('/class/:className', studentController.getStudentsByClass);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Create new student
router.post('/', studentController.createStudent);

// Update student
router.put('/:id', studentController.updateStudent);

// Delete student
router.delete('/:id', studentController.deleteStudent);

// Image optimization routes
router.get('/image/:public_id', studentController.getImageDetails);
router.get('/image/optimize', studentController.getOptimizedImageUrl);

module.exports = router; 