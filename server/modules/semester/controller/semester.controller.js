const SemesterRepository = require('../repository/semester.repository');
const asyncHandler = require('../../../middleware/asyncHandler');
const ErrorResponse = require('../../../utils/errorResponse');
const { validateSemester } = require('../model/semester.model');

class SemesterController {
    constructor() {
        this.semesterRepository = new SemesterRepository();
    }

    // @desc    Get all semesters
    // @route   GET /api/semester
    // @access  Private
    getAllSemesters = asyncHandler(async (req, res) => {
        console.log('GET /api/semester - Fetching all semesters...');
        const semesters = await this.semesterRepository.findAll();
        console.log('Sending response with semesters:', { success: true, data: semesters });
        res.json({
            success: true,
            data: semesters
        });
    });

    // @desc    Get semester by ID
    // @route   GET /api/semester/:id
    // @access  Private
    getSemesterById = asyncHandler(async (req, res) => {
        const semester = await this.semesterRepository.findById(req.params.id);
        res.json({
            success: true,
            data: semester
        });
    });

    // @desc    Create new semester
    // @route   POST /api/semester
    // @access  Private
    createSemester = asyncHandler(async (req, res) => {
        const { isValid, errors } = validateSemester(req.body);
        if (!isValid) {
            throw new ErrorResponse(Object.values(errors)[0], 400);
        }

        const semester = await this.semesterRepository.create(req.body);
        res.status(201).json({
            success: true,
            data: semester
        });
    });

    // @desc    Import semesters from Excel
    // @route   POST /api/semester/import
    // @access  Private
    importSemesters = asyncHandler(async (req, res) => {
        const { semesters } = req.body;

        // Validate request body
        if (!Array.isArray(semesters)) {
            throw new ErrorResponse('Invalid request format. Expected an array of semesters.', 400);
        }

        if (semesters.length === 0) {
            throw new ErrorResponse('No semester data provided.', 400);
        }

        const results = {
            success: [],
            errors: [],
            duplicates: []
        };

        // Process each semester
        for (const semesterData of semesters) {
            try {
                // Basic validation
                if (!semesterData.semesterName || !semesterData.startDate || !semesterData.endDate) {
                    throw new Error('Missing required fields');
                }

                // Format the data
                const formattedData = {
                    semesterName: semesterData.semesterName.trim(),
                    startDate: this.validateAndFormatDate(semesterData.startDate),
                    endDate: this.validateAndFormatDate(semesterData.endDate)
                };

                // Validate dates
                if (!formattedData.startDate || !formattedData.endDate) {
                    throw new Error('Invalid date format. Use DD-MM-YYYY');
                }

                // Check if start date is before end date
                if (new Date(formattedData.startDate) >= new Date(formattedData.endDate)) {
                    throw new Error('Start date must be before end date');
                }

                // Check for duplicate semester name
                const existingSemesters = await this.semesterRepository.findByName(formattedData.semesterName);
                if (existingSemesters.length > 0) {
                    results.duplicates.push({
                        semesterName: formattedData.semesterName,
                        message: 'Semester with this name already exists'
                    });
                    continue;
                }

                // Create semester
                const semester = await this.semesterRepository.create(formattedData);
                results.success.push(semester);
            } catch (error) {
                results.errors.push({
                    semesterName: semesterData.semesterName || 'Unknown',
                    error: error.message || 'Unknown error occurred'
                });
            }
        }

        // Prepare response message
        const summary = {
            total: semesters.length,
            imported: results.success.length,
            failed: results.errors.length,
            duplicates: results.duplicates.length
        };

        // If no successful imports and we have errors
        if (summary.imported === 0 && (summary.failed > 0 || summary.duplicates > 0)) {
            throw new ErrorResponse(
                `Failed to import semesters: ${results.errors.map(e => `${e.semesterName}: ${e.error}`).join('; ')}`,
                400
            );
        }

        res.status(201).json({
            success: true,
            data: {
                ...summary,
                details: results
            }
        });
    });

    // Helper method to validate and format date
    validateAndFormatDate = (date) => {
        if (!date) return null;

        // If already in DD-MM-YYYY format
        if (typeof date === 'string' && /^\d{2}-\d{2}-\d{4}$/.test(date)) {
            // Validate the date parts
            const [day, month, year] = date.split('-').map(Number);
            const dateObj = new Date(year, month - 1, day);
            if (
                dateObj.getDate() === day &&
                dateObj.getMonth() === month - 1 &&
                dateObj.getFullYear() === year
            ) {
                return date;
            }
        }

        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return null;
            }
            return dateObj.toLocaleDateString('en-GB').split('/').join('-');
        } catch (error) {
            return null;
        }
    };

    // @desc    Update semester
    // @route   PUT /api/semester/:id
    // @access  Private
    updateSemester = asyncHandler(async (req, res) => {
        const { isValid, errors } = validateSemester(req.body);
        if (!isValid) {
            throw new ErrorResponse(Object.values(errors)[0], 400);
        }

        const semester = await this.semesterRepository.update(req.params.id, req.body);
        res.json({
            success: true,
            data: semester
        });
    });

    // @desc    Delete semester
    // @route   DELETE /api/semester/:id
    // @access  Private
    deleteSemester = asyncHandler(async (req, res) => {
        await this.semesterRepository.delete(req.params.id);
        res.status(204).send();
    });
}

module.exports = new SemesterController(); 