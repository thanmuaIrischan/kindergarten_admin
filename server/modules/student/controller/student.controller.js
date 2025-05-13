const { StudentService } = require('../service/student.service');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');
const upload = multer({ storage: multer.memoryStorage() });
const { db } = require('../../../config/firebase');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class StudentController {
    constructor() {
        this.studentService = new StudentService();
    }

    // @desc    Upload file to Cloudinary
    // @route   POST /api/student/upload
    // @access  Private
    uploadFile = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ErrorResponse('Please upload a file', 400);
        }

        try {
            // Convert buffer to stream
            const stream = Readable.from(req.file.buffer);

            // Create upload stream
            const uploadPromise = new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: 'kindergarten/student/photos',
                        resource_type: 'auto',
                        transformation: [
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary upload error:', error);
                            reject(new ErrorResponse('Failed to upload file to Cloudinary', 500));
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.pipe(uploadStream);
            });

            const result = await uploadPromise;

            res.status(200).json({
                success: true,
                url: result.secure_url,
                public_id: result.public_id,
                message: 'File uploaded successfully'
            });
        } catch (error) {
            console.error('Upload error:', error);
            if (error instanceof ErrorResponse) {
                throw error;
            }
            throw new ErrorResponse(error.message || 'Error uploading file', 500);
        }
    });

    // @desc    Upload student document (photo, birth certificate, household registration)
    // @route   POST /api/student/document/upload
    // @access  Private
    uploadStudentDocument = asyncHandler(async (req, res) => {
        console.log('Starting document upload...');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file ? {
            fieldname: req.file.fieldname,
            mimetype: req.file.mimetype,
            size: req.file.size
        } : 'No file');

        try {
            // Validate file
            if (!req.file) {
                throw new ErrorResponse('No file uploaded', 400);
            }

            // Validate document type
            const { documentType } = req.body;
            if (!documentType || !['image', 'birthCertificate', 'householdRegistration'].includes(documentType)) {
                throw new ErrorResponse('Invalid document type', 400);
            }

            // Log upload attempt
            console.log(`Attempting to upload ${documentType}...`);

            // Create upload stream
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `kindergarten/student/${documentType === 'image' ? 'photos' : 'documents'}`,
                    resource_type: 'auto',
                    transformation: documentType === 'image' ? [
                        { width: 500, height: 500, crop: "fill", gravity: "face" },
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ] : [
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        return res.status(500).json({
                            success: false,
                            error: 'Failed to upload file to Cloudinary',
                            details: error.message
                        });
                    }

                    // Return success response
                    res.status(200).json({
                        success: true,
                        data: {
                            url: result.secure_url,
                            public_id: result.public_id,
                            documentType
                        },
                        message: 'Document uploaded successfully'
                    });
                }
            );

            // Pipe the file buffer to the upload stream
            const stream = Readable.from(req.file.buffer);
            stream.pipe(uploadStream);

        } catch (error) {
            console.error('Document upload error:', error);
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message || 'Error uploading document'
            });
        }
    });

    // @desc    Create new student with documents
    // @route   POST /api/students
    // @access  Private
    createStudent = asyncHandler(async (req, res) => {
        try {
            const studentData = req.body;
            
            // Format the data to match Firebase structure
            const formattedData = {
                studentProfile: {
                    studentID: studentData.studentID,
                    name: studentData.name,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    dateOfBirth: studentData.dateOfBirth,
                    gender: studentData.gender,
                    gradeLevel: parseInt(studentData.gradeLevel),
                    class: studentData.class,
                    school: studentData.school,
                    educationSystem: studentData.educationSystem,
                    fatherFullname: studentData.fatherName,
                    fatherOccupation: studentData.fatherOccupation,
                    motherFullname: studentData.motherName,
                    motherOccupation: studentData.motherOccupation
                },
                studentDocument: {
                    image: studentData.image?.public_id || null,
                    birthCertificate: studentData.birthCertificate?.public_id || null,
                    householdRegistration: studentData.householdRegistration?.public_id || null
                }
            };

            // Create student in Firebase
            const studentRef = await this.studentService.createStudent(formattedData);
            
            res.status(201).json({
                success: true,
                data: studentRef
            });
        } catch (error) {
            console.error('Create student error:', error);
            res.status(error.statusCode || 500).json({
                success: false,
                error: error.message || 'Error creating student'
            });
        }
    });

    // @desc    Get all students
    // @route   GET /api/students
    // @access  Private
    getAllStudents = asyncHandler(async (req, res) => {
        const students = await this.studentService.getAllStudents();

        if (!students || !Array.isArray(students)) {
            throw new ErrorResponse('Invalid data received from service', 500);
        }

        res.json({
            success: true,
            data: students
        });
    });

    // @desc    Get student by ID
    // @route   GET /api/students/:id
    // @access  Private
    getStudentById = asyncHandler(async (req, res) => {
        const student = await this.studentService.getStudentById(req.params.id);
        res.json({
            success: true,
            data: student
        });
    });

    // @desc    Update student
    // @route   PUT /api/students/:id
    // @access  Private
    updateStudent = asyncHandler(async (req, res) => {
        const student = await this.studentService.updateStudent(req.params.id, req.body);
        res.json({
            success: true,
            data: student
        });
    });

    // @desc    Delete student
    // @route   DELETE /api/students/:id
    // @access  Private
    deleteStudent = asyncHandler(async (req, res) => {
        await this.studentService.deleteStudent(req.params.id);
        res.status(204).send();
    });

    // @desc    Get students by class
    // @route   GET /api/students/class/:className
    // @access  Private
    getStudentsByClass = asyncHandler(async (req, res) => {
        const students = await this.studentService.getStudentsByClass(req.params.className);
        res.json({
            success: true,
            data: students
        });
    });

    // @desc    Search students
    // @route   GET /api/students/search
    // @access  Private
    searchStudents = asyncHandler(async (req, res) => {
        const { term } = req.query;
        const students = await this.studentService.searchStudents(term);
        res.json({
            success: true,
            data: students
        });
    });

    // @desc    Get image details from Cloudinary
    // @route   GET /api/students/image/:public_id
    // @access  Private
    getImageDetails = asyncHandler(async (req, res) => {
        const { public_id } = req.params;

        if (!public_id) {
            throw new ErrorResponse('Public ID is required', 400);
        }

        const result = await cloudinary.api.resource(public_id, {
            colors: true,
            image_metadata: true,
            quality_analysis: true
        });

        res.json({
            success: true,
            data: {
                format: result.format,
                size: result.bytes,
                width: result.width,
                height: result.height,
                url: result.secure_url,
                created_at: result.created_at,
                metadata: result.image_metadata,
                colors: result.colors,
                quality: result.quality_analysis
            }
        });
    });

    // @desc    Get optimized image URL
    // @route   GET /api/students/image/optimize
    // @access  Private
    getOptimizedImageUrl = asyncHandler(async (req, res) => {
        const { public_id, width, height, quality } = req.query;

        if (!public_id) {
            throw new ErrorResponse('Public ID is required', 400);
        }

        const transformationOptions = {
            quality: quality || 'auto',
            fetch_format: 'auto',
            secure: true
        };

        if (width) transformationOptions.width = parseInt(width);
        if (height) transformationOptions.height = parseInt(height);

        const url = cloudinary.url(public_id, transformationOptions);

        res.json({
            success: true,
            data: { url }
        });
    });

    importStudents = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ErrorResponse('Please upload a file', 400);
        }

        try {
            const result = await this.studentService.importStudents(req.file);
            res.json({
                success: true,
                count: result.count,
                message: `Successfully imported ${result.count} students`
            });
        } catch (error) {
            console.error('Error in importStudents:', error);
            throw new ErrorResponse(error.message || 'Failed to import students', 500);
        }
    });

    exportStudents = asyncHandler(async (req, res) => {
        try {
            console.log('Export request received:', {
                format: req.params.format,
                method: req.method,
                body: req.body
            });

            const format = req.params.format;
            if (!['xlsx', 'json'].includes(format)) {
                throw new ErrorResponse('Invalid export format. Use xlsx or json.', 400);
            }

            // Get students from request body for POST, or fetch all students for GET
            let students;
            if (req.method === 'POST') {
                students = req.body.students;
                if (!Array.isArray(students)) {
                    throw new ErrorResponse('Students data must be an array', 400);
                }
            } else {
                // For GET requests, fetch all students
                students = await this.studentService.getAllStudents();
            }

            console.log(`Processing ${students.length} students for export`);

            const data = await this.studentService.exportStudents(format, students);

            if (format === 'xlsx') {
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
                res.send(data);
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.setHeader('Content-Disposition', 'attachment; filename=students.json');
                res.send(data);
            }
        } catch (error) {
            console.error('Error in exportStudents controller:', error);
            throw new ErrorResponse(error.message || 'Failed to export students', 500);
        }
    });

    // @desc    Check if student ID exists
    // @route   GET /api/student/check-id/:id
    // @access  Private
    checkStudentId = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            console.log('Checking student ID:', id);
            
            // Query Firebase for student with this ID
            const studentsRef = db.collection('student');
            const snapshot = await studentsRef.where('studentProfile.studentID', '==', id).get();
            
            // Check if any documents exist with this studentID
            const exists = !snapshot.empty;
            
            console.log(`Checking student ID: ${id}, Exists: ${exists}`);
            
            res.json({
                success: true,
                exists: exists,
                message: exists ? 'Student ID already exists' : 'Student ID is available'
            });
        } catch (error) {
            console.error('Error checking student ID:', error);
            res.status(500).json({
                success: false,
                error: 'Error checking student ID'
            });
        }
    });
}

const studentController = new StudentController();
module.exports = studentController; 