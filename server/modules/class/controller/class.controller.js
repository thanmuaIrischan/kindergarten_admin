const ClassService = require('../service/class.service');
const ErrorResponse = require('../../../utils/errorResponse');

class ClassController {
    constructor() {
        this.service = new ClassService();
    }

    getAllClasses = async (req, res, next) => {
        try {
            const classes = await this.service.getAllClasses();
            res.status(200).json({
                success: true,
                data: classes
            });
        } catch (error) {
            next(error);
        }
    };

    getClassById = async (req, res, next) => {
        try {
            const classData = await this.service.getClassById(req.params.id);
            res.status(200).json({
                success: true,
                data: classData
            });
        } catch (error) {
            next(error);
        }
    };

    createClass = async (req, res, next) => {
        try {
            const classData = await this.service.createClass(req.body);
            res.status(201).json({
                success: true,
                data: classData
            });
        } catch (error) {
            next(error);
        }
    };

    updateClass = async (req, res, next) => {
        try {
            const classData = await this.service.updateClass(req.params.id, req.body);
            res.status(200).json({
                success: true,
                data: classData
            });
        } catch (error) {
            next(error);
        }
    };

    updateClassTeacher = async (req, res, next) => {
        try {
            const { teacherID } = req.body;
            const classData = await this.service.updateClassTeacher(req.params.id, teacherID);
            res.status(200).json({
                success: true,
                data: classData
            });
        } catch (error) {
            next(error);
        }
    };

    deleteClass = async (req, res, next) => {
        try {
            await this.service.deleteClass(req.params.id);
            res.status(200).json({
                success: true,
                data: {}
            });
        } catch (error) {
            next(error);
        }
    };

    importClasses = async (req, res, next) => {
        try {
            const result = await this.service.importClasses(req.body.classes);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = new ClassController(); 