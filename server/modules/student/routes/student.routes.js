const express = require('express');
const router = express.Router();
const multer = require('multer');
const studentController = require('../controller/student.controller');
const { db } = require('../../../config/firebase');
const { Readable } = require('stream');

// Configure multer for Excel file uploads (for import)
const excelUpload = multer({
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

// Configure multer for document uploads
const documentUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and PDFs
        if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only images and PDFs are allowed!'), false);
        }
    }
});

// Export routes - must be before other routes
router.get('/export/:format', studentController.exportStudents);
router.post('/export/:format', studentController.exportStudents);

// Import route
router.post('/import', excelUpload.single('file'), studentController.importStudents);

// File upload routes - must be before /:id routes
router.post('/upload', documentUpload.single('file'), studentController.uploadFile);
router.post('/document/upload', documentUpload.single('file'), studentController.uploadStudentDocument);

// Image optimization routes
router.get('/image/:public_id', studentController.getImageDetails);
router.get('/image/optimize', studentController.getOptimizedImageUrl);

// Check student ID route - must be before /:id routes
router.get('/check-id/:id', studentController.checkStudentId);

// Search students
router.get('/search', studentController.searchStudents);

// Get students by class
router.get('/class/:className', studentController.getStudentsByClass);

// Get all students
router.get('/', studentController.getAllStudents);

// Get student by ID
router.get('/:id', studentController.getStudentById);

// Create new student
router.post('/', studentController.createStudent);

// Update student
router.put('/:id', studentController.updateStudent);

// Delete student
router.delete('/:id', studentController.deleteStudent);

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

module.exports = router; 