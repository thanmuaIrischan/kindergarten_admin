const teacherRepository = require('../repositories/teacher.repository');

class TeacherService {
    async getAllTeachers() {
        try {
            return await teacherRepository.findAll();
        } catch (error) {
            throw this.handleError(error, 'Error getting all teachers');
        }
    }

    async getTeacherById(id) {
        try {
            if (!id) {
                throw new Error('Teacher ID is required');
            }
            return await teacherRepository.findById(id);
        } catch (error) {
            throw this.handleError(error, 'Error getting teacher by ID');
        }
    }

    async createTeacher(teacherData) {
        try {
            this.validateTeacherData(teacherData);
            return await teacherRepository.create(teacherData);
        } catch (error) {
            throw this.handleError(error, 'Error creating teacher');
        }
    }

    async updateTeacher(id, teacherData) {
        try {
            if (!id) {
                throw new Error('Teacher ID is required');
            }
            this.validateTeacherData(teacherData);
            return await teacherRepository.update(id, teacherData);
        } catch (error) {
            throw this.handleError(error, 'Error updating teacher');
        }
    }

    async deleteTeacher(id) {
        try {
            if (!id) {
                throw new Error('Teacher ID is required');
            }
            return await teacherRepository.delete(id);
        } catch (error) {
            throw this.handleError(error, 'Error deleting teacher');
        }
    }

    async searchTeachers(query) {
        try {
            if (!query) {
                throw new Error('Search query is required');
            }
            return await teacherRepository.search(query);
        } catch (error) {
            throw this.handleError(error, 'Error searching teachers');
        }
    }

    validateTeacherData(data) {
        if (!data) {
            throw new Error('Teacher data is required');
        }

        // Additional service-level validations can be added here
        // For example, business logic validations that are not part of the repository validation

        // Validate name length
        if (data.firstName && data.firstName.length > 50) {
            throw new Error('First name cannot exceed 50 characters');
        }
        if (data.lastName && data.lastName.length > 50) {
            throw new Error('Last name cannot exceed 50 characters');
        }

        // Validate email format if provided
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                throw new Error('Invalid email format');
            }
        }

        // Validate address length if provided
        if (data.address && data.address.length > 200) {
            throw new Error('Address cannot exceed 200 characters');
        }

        // Validate date of birth (must be at least 18 years old)
        if (data.dateOfBirth) {
            const dob = new Date(data.dateOfBirth);
            const today = new Date();
            const age = today.getFullYear() - dob.getFullYear();
            const monthDiff = today.getMonth() - dob.getMonth();

            if (age < 18 || (age === 18 && monthDiff < 0)) {
                throw new Error('Teacher must be at least 18 years old');
            }
        }
    }

    handleError(error, defaultMessage) {
        console.error('Teacher Service Error:', error);

        // If it's already a custom error from the repository, pass it through
        if (error.message && !error.message.includes('Error:')) {
            return error;
        }

        // Create a new error with additional context
        const errorMessage = error.message || defaultMessage;
        const enhancedError = new Error(errorMessage);
        enhancedError.originalError = error;
        enhancedError.timestamp = new Date().toISOString();

        return enhancedError;
    }
}

module.exports = new TeacherService(); 