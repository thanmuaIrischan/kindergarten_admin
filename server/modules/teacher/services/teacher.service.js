const teacherRepository = require('../repositories/teacher.repository');

class TeacherService {
    async getAllTeachers() {
        try {
            return await teacherRepository.findAll();
        } catch (error) {
            throw error;
        }
    }

    async getTeacherById(id) {
        try {
            return await teacherRepository.findById(id);
        } catch (error) {
            throw error;
        }
    }

    async createTeacher(teacherData) {
        try {
            const newTeacherData = {
                ...teacherData,
                createdAt: new Date().toISOString()
            };
            return await teacherRepository.create(newTeacherData);
        } catch (error) {
            throw error;
        }
    }

    async updateTeacher(id, teacherData) {
        try {
            const updatedTeacherData = {
                ...teacherData,
                updatedAt: new Date().toISOString()
            };
            return await teacherRepository.update(id, updatedTeacherData);
        } catch (error) {
            throw error;
        }
    }

    async deleteTeacher(id) {
        try {
            return await teacherRepository.delete(id);
        } catch (error) {
            throw error;
        }
    }

    async searchTeachers(query) {
        try {
            return await teacherRepository.search(query);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new TeacherService(); 