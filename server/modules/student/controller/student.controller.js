const { StudentService } = require('../service/student.service');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');
const upload = multer({ storage: multer.memoryStorage() });
const { db } = require('../../../config/firebase');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class StudentController {
    constructor() {
        this.studentService = new StudentService();
    }

    uploadFile = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ErrorResponse('Please upload a file', 400);
        }

        const stream = Readable.from(req.file.buffer);
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'kindergarten/student/photos',
                    resource_type: 'auto',
                    transformation: [
                        { quality: 'auto' },
                        { fetch_format: 'auto' }
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
    });

    uploadStudentDocument = asyncHandler(async (req, res) => {
        if (!req.file) {
            throw new ErrorResponse('No file uploaded', 400);
        }

        const { documentType } = req.body;
        if (!['image', 'birthCertificate', 'householdRegistration'].includes(documentType)) {
            throw new ErrorResponse('Invalid document type', 400);
        }

        const folder = documentType === 'image' ? 'photos' : 'documents';
        const transformations = documentType === 'image' ? [
            { width: 500, height: 500, crop: 'fill', gravity: 'face' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ] : [
            { quality: 'auto' },
            { fetch_format: 'auto' }
        ];

        const stream = Readable.from(req.file.buffer);
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: `kindergarten/student/${folder}`,
                    resource_type: 'auto',
                    transformation: transformations
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
            data: {
                url: result.secure_url,
                public_id: result.public_id,
                documentType
            },
            message: 'Document uploaded successfully'
        });
    });

    createStudent = asyncHandler(async (req, res) => {
        try {
            const studentData = req.body;
            console.log('Server received student data:', {
                rawData: studentData,
                hasStudentProfile: !!studentData.studentProfile,
                studentProfileFields: studentData.studentProfile ? Object.keys(studentData.studentProfile) : [],
                documentFields: studentData.studentDocument ? Object.keys(studentData.studentDocument) : []
            });

            // Check if studentProfile exists
            if (!studentData.studentProfile) {
                console.log('Missing studentProfile object');
                throw new ErrorResponse('Invalid request format: missing studentProfile', 400);
            }

            // Check if studentID exists
            const snapshot = await db.collection('student')
                .where('studentProfile.studentID', '==', studentData.studentProfile.studentID)
                .get();
            if (!snapshot.empty) {
                console.log('Student ID already exists:', studentData.studentProfile.studentID);
                throw new ErrorResponse('Student ID already exists', 400);
            }

            // Validate all required fields
            const requiredFields = ['studentID', 'name', 'dateOfBirth', 'gender', 'gradeLevel', 'class'];
            const missingFields = requiredFields.filter(field => {
                const value = studentData.studentProfile[field];
                const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
                if (isEmpty) {
                    console.log(`Missing required field: ${field}, value:`, value);
                }
                return isEmpty;
            });

            if (missingFields.length > 0) {
                console.log('Validation failed - missing fields:', {
                    missingFields,
                    providedValues: requiredFields.reduce((acc, field) => ({
                        ...acc,
                        [field]: studentData.studentProfile[field]
                    }), {})
                });
                throw new ErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400);
            }

            // Validate date of birth
            if (studentData.studentProfile.dateOfBirth) {
                const [day, month, year] = studentData.studentProfile.dateOfBirth.split('-').map(Number);
                const dobDate = new Date(year, month - 1, day);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                console.log('Date validation:', {
                    providedDate: studentData.studentProfile.dateOfBirth,
                    parsedComponents: { day, month, year },
                    parsedDate: dobDate,
                    today
                });

                if (isNaN(dobDate.getTime())) {
                    console.log('Invalid date format');
                    throw new ErrorResponse('Invalid date of birth format', 400);
                }
                if (dobDate > today) {
                    console.log('Future date detected');
                    throw new ErrorResponse('Date of birth cannot be in the future', 400);
                }
            }

            const formattedData = {
                studentProfile: {
                    studentID: studentData.studentProfile.studentID,
                    name: studentData.studentProfile.name,
                    dateOfBirth: studentData.studentProfile.dateOfBirth,
                    gender: studentData.studentProfile.gender,
                    fatherFullname: studentData.studentProfile.fatherFullname,
                    fatherOccupation: studentData.studentProfile.fatherOccupation,
                    motherFullname: studentData.studentProfile.motherFullname,
                    motherOccupation: studentData.studentProfile.motherOccupation,
                    gradeLevel: parseInt(studentData.studentProfile.gradeLevel),
                    school: studentData.studentProfile.school,
                    class: studentData.studentProfile.class,
                    educationSystem: studentData.studentProfile.educationSystem
                },
                studentDocument: {
                    image: studentData.studentDocument?.image || '',
                    birthCertificate: studentData.studentDocument?.birthCertificate || '',
                    householdRegistration: studentData.studentDocument?.householdRegistration || ''
                }
            };

            console.log('Formatted data for database:', formattedData);

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

    getAllStudents = asyncHandler(async (req, res) => {
        const { page = 1, limit = 10 } = req.query;
        const students = await this.studentService.getAllStudents({
            page: parseInt(page),
            limit: parseInt(limit),
        });

        // Flatten data, handle both flat and nested structures
        const flattenedStudents = students.map(student => {
            const studentProfile = student.studentProfile || student;
            const studentDocument = student.studentDocument || {};
            return {
                id: student.id,
                firstName: studentProfile.firstName || studentProfile.name?.split(' ').slice(-1)[0] || 'N/A',
                lastName: studentProfile.lastName || studentProfile.name?.split(' ').slice(0, -1).join(' ') || 'N/A',
                name: [
                    studentProfile.lastName || studentProfile.name?.split(' ').slice(0, -1).join(' '),
                    studentProfile.firstName || studentProfile.name?.split(' ').slice(-1)[0],
                ].filter(Boolean).join(' ') || 'N/A',
                studentID: studentProfile.studentID || 'N/A',
                fatherName: studentProfile.fatherName || studentProfile.fatherFullname || '',
                motherName: studentProfile.motherName || studentProfile.motherFullname || '',
                class: studentProfile.class || 'N/A',
                school: studentProfile.school || 'N/A',
                gradeLevel: studentProfile.gradeLevel || 'N/A',
                gender: studentProfile.gender || 'N/A',
                dateOfBirth: studentProfile.dateOfBirth || 'N/A',
                educationSystem: studentProfile.educationSystem || 'N/A',
                fatherOccupation: studentProfile.fatherOccupation || 'N/A',
                motherOccupation: studentProfile.motherOccupation || 'N/A',
                parentContact: studentProfile.parentContact || 'N/A',
                image: studentDocument.image || '',
                birthCertificate: studentDocument.birthCertificate || '',
                householdRegistration: studentDocument.householdRegistration || '',
            };
        });

        res.json({
            success: true,
            data: flattenedStudents,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: students.length,
            },
        });
    });

    getStudentById = asyncHandler(async (req, res) => {
        const student = await this.studentService.getStudentById(req.params.id);
        res.json({
            success: true,
            data: student
        });
    });

    updateStudent = asyncHandler(async (req, res) => {
        const studentData = {
            studentID: req.body.studentID,
            name: req.body.name,
            dateOfBirth: req.body.dateOfBirth,
            gender: req.body.gender,
            fatherFullname: req.body.fatherFullname,
            fatherOccupation: req.body.fatherOccupation,
            motherFullname: req.body.motherFullname,
            motherOccupation: req.body.motherOccupation,
            gradeLevel: parseInt(req.body.gradeLevel),
            school: req.body.school,
            class: req.body.class,
            educationSystem: req.body.educationSystem,
            image: req.body.studentDocument.image,
            birthCertificate: req.body.studentDocument.birthCertificate,
            householdRegistration: req.body.studentDocument.householdRegistration
        };

        const student = await this.studentService.updateStudent(req.params.id, studentData);
        res.json({
            success: true,
            data: student
        });
    });

    deleteStudent = asyncHandler(async (req, res) => {
        await this.studentService.deleteStudent(req.params.id);
        res.status(204).send();
    });

    getStudentsByClass = asyncHandler(async (req, res) => {
        const students = await this.studentService.getStudentsByClass(req.params.className);
        res.json({
            success: true,
            data: students
        });
    });

    searchStudents = asyncHandler(async (req, res) => {
        const { term } = req.query;
        const students = await this.studentService.searchStudents(term);
        res.json({
            success: true,
            data: students
        });
    });

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
            const format = req.params.format;
            if (!['xlsx', 'json'].includes(format)) {
                throw new ErrorResponse('Invalid export format. Use xlsx or json.', 400);
            }

            let students;
            if (req.method === 'POST') {
                students = req.body.students;
                if (!Array.isArray(students)) {
                    throw new ErrorResponse('Students data must be an array', 400);
                }
            } else {
                students = await this.studentService.getAllStudents();
            }

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

    checkStudentId = asyncHandler(async (req, res) => {
        try {
            const { id } = req.params;
            const snapshot = await db.collection('student')
                .where('studentProfile.studentID', '==', id)
                .get();
            
            const exists = !snapshot.empty;
            
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