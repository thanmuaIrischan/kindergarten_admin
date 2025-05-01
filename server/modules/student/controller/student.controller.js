const { StudentService } = require('../service/student.service');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

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
                        if (error) reject(error);
                        else resolve(result);
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
            throw new ErrorResponse(error.message || 'Error uploading file', 500);
        }
    });

    // @desc    Add new student
    // @route   POST /api/students
    // @access  Private
    createStudent = asyncHandler(async (req, res, next) => {
        const student = await this.studentService.createStudent(req.body);

        res.status(201).json({
            success: true,
            data: student
        });
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
}

module.exports = new StudentController(); 