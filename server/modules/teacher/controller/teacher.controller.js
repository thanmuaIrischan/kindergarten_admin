const asyncHandler = require('../../../middleware/async');
const ErrorResponse = require('../../../utils/errorResponse');
const TeacherRepository = require('../repositories/teacher.repository');

class TeacherController {
    constructor() {
        this.teacherRepository = new TeacherRepository();
    }

    // @desc    Get all teachers
    // @route   GET /api/teacher
    // @access  Public
    getAllTeachers = asyncHandler(async (req, res) => {
        const teachers = await this.teacherRepository.findAll();
        res.status(200).json(teachers);
    });

    // @desc    Get teacher by ID
    // @route   GET /api/teacher/:id
    // @access  Public
    getTeacherById = asyncHandler(async (req, res) => {
        const teacher = await this.teacherRepository.findById(req.params.id);
        if (!teacher) {
            throw new ErrorResponse('Teacher not found', 404);
        }
        res.status(200).json(teacher);
    });

    // @desc    Create new teacher
    // @route   POST /api/teacher
    // @access  Private
    createTeacher = asyncHandler(async (req, res) => {
        const teacherData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            teacherID: req.body.teacherID,
            gender: req.body.gender,
            phone: req.body.phone,
            dateOfBirth: req.body.dateOfBirth,
            avatar: req.body.avatar || ''
        };

        const teacher = await this.teacherRepository.create(teacherData);
        res.status(201).json(teacher);
    });

    // @desc    Update teacher
    // @route   PUT /api/teacher/:id
    // @access  Private
    updateTeacher = asyncHandler(async (req, res) => {
        const teacherData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            teacherID: req.body.teacherID,
            gender: req.body.gender,
            phone: req.body.phone,
            dateOfBirth: req.body.dateOfBirth,
            avatar: req.body.avatar || ''
        };

        const teacher = await this.teacherRepository.update(req.params.id, teacherData);
        res.status(200).json(teacher);
    });

    // @desc    Delete teacher
    // @route   DELETE /api/teacher/:id
    // @access  Private
    deleteTeacher = asyncHandler(async (req, res) => {
        await this.teacherRepository.delete(req.params.id);
        res.status(204).send();
    });

    // @desc    Search teachers
    // @route   GET /api/teacher/search
    // @access  Public
    searchTeachers = asyncHandler(async (req, res) => {
        const query = req.query.query || '';
        const teachers = await this.teacherRepository.search(query);
        res.status(200).json(teachers);
    });

    // @desc    Import teachers from Excel
    // @route   POST /api/teacher/import
    // @access  Private
    importTeachers = asyncHandler(async (req, res) => {
        const { teachers } = req.body;

        // Validate request body
        if (!Array.isArray(teachers)) {
            throw new ErrorResponse('Invalid request format. Expected an array of teachers.', 400);
        }

        if (teachers.length === 0) {
            throw new ErrorResponse('No teacher data provided.', 400);
        }

        const results = await this.teacherRepository.importTeachers(teachers);

        // If no successful imports and we have errors
        if (results.imported === 0 && (results.failed > 0 || results.duplicates > 0)) {
            throw new ErrorResponse(
                `Failed to import teachers: ${results.details.errors.map(e => `${e.teacherID}: ${e.error}`).join('; ')}`,
                400
            );
        }

        res.status(201).json({
            success: true,
            data: results
        });
    });

    // @desc    Get teachers data for printing
    // @route   GET /api/teacher/print
    // @access  Public
    getPrintData = asyncHandler(async (req, res) => {
        const filters = {
            searchTerm: req.query.search || ''
        };

        const printData = await this.teacherRepository.getPrintData(filters);

        res.status(200).json({
            success: true,
            data: {
                teachers: printData,
                generatedAt: new Date().toISOString(),
                totalCount: printData.length
            }
        });
    });

    // @desc    Get teacher by teacherID
    // @route   GET /api/teacher/by-teacher-id/:teacherID
    // @access  Public
    getTeacherByTeacherId = asyncHandler(async (req, res) => {
        console.log('Searching for teacher with ID:', req.params.teacherID);

        const teacher = await this.teacherRepository.findByTeacherId(req.params.teacherID);
        console.log('Found teacher:', teacher);

        if (!teacher) {
            console.log('No teacher found with ID:', req.params.teacherID);
            throw new ErrorResponse(`No teacher found with ID: ${req.params.teacherID}`, 404);
        }

        res.status(200).json(teacher);  // Return the teacher data directly
    });
}

// Create a singleton instance
const teacherController = new TeacherController();

// Export instance methods
module.exports = {
    getAllTeachers: teacherController.getAllTeachers,
    getTeacherById: teacherController.getTeacherById,
    createTeacher: teacherController.createTeacher,
    updateTeacher: teacherController.updateTeacher,
    deleteTeacher: teacherController.deleteTeacher,
    searchTeachers: teacherController.searchTeachers,
    importTeachers: teacherController.importTeachers,
    getPrintData: teacherController.getPrintData,
    getTeacherByTeacherId: teacherController.getTeacherByTeacherId
}; 