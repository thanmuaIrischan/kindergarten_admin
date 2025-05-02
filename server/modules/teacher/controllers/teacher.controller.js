const teacherService = require('../services/teacher.service');

class TeacherController {
    static async getAllTeachers(req, res) {
        try {
            const teachers = await teacherService.getAllTeachers();
            res.status(200).json({
                success: true,
                data: teachers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getTeacherById(req, res) {
        try {
            const teacher = await teacherService.getTeacherById(req.params.id);
            res.status(200).json({
                success: true,
                data: teacher
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createTeacher(req, res) {
        try {
            const teacherData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                teacherID: req.body.teacherID,
                gender: req.body.gender,
                phone: req.body.phone,
                dateOfBirth: req.body.dateOfBirth,
                avatar: req.body.avatar || '',
                email: req.body.email || '',
                address: req.body.address || ''
            };

            const newTeacher = await teacherService.createTeacher(teacherData);
            res.status(201).json({
                success: true,
                data: newTeacher
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateTeacher(req, res) {
        try {
            const teacherData = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                teacherID: req.body.teacherID,
                gender: req.body.gender,
                phone: req.body.phone,
                dateOfBirth: req.body.dateOfBirth,
                avatar: req.body.avatar,
                email: req.body.email,
                address: req.body.address
            };

            const updatedTeacher = await teacherService.updateTeacher(req.params.id, teacherData);
            res.status(200).json({
                success: true,
                data: updatedTeacher
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteTeacher(req, res) {
        try {
            await teacherService.deleteTeacher(req.params.id);
            res.status(200).json({
                success: true,
                message: 'Teacher deleted successfully'
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async searchTeachers(req, res) {
        try {
            const query = req.query.query || '';
            const teachers = await teacherService.searchTeachers(query);
            res.status(200).json({
                success: true,
                data: teachers
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = TeacherController; 