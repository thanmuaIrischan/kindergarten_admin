const ClassRepository = require('../repository/class.repository');
const { validateClass } = require('../model/class.model');
const ErrorResponse = require('../../../utils/errorResponse');

class ClassService {
    constructor() {
        this.repository = new ClassRepository();
    }

    async getAllClasses() {
        return this.repository.findAll();
    }

    async getClassById(id) {
        return this.repository.findById(id);
    }

    async createClass(classData) {
        const validation = validateClass(classData);
        if (!validation.isValid) {
            throw new ErrorResponse(validation.errors, 400);
        }
        return this.repository.create(classData);
    }

    async updateClass(id, classData) {
        const validation = validateClass(classData);
        if (!validation.isValid) {
            throw new ErrorResponse(validation.errors, 400);
        }
        return this.repository.update(id, classData);
    }

    async deleteClass(id) {
        return this.repository.delete(id);
    }

    async findClassByName(className) {
        return this.repository.findByName(className);
    }

    async importClasses(data) {
        const importedClasses = [];
        const failedImports = [];

        for (const classData of data) {
            try {
                const validation = validateClass(classData);
                if (validation.isValid) {
                    const importedClass = await this.repository.create(classData);
                    importedClasses.push(importedClass);
                } else {
                    failedImports.push({
                        data: classData,
                        errors: validation.errors
                    });
                }
            } catch (error) {
                failedImports.push({
                    data: classData,
                    errors: error.message
                });
            }
        }

        return {
            imported: importedClasses.length,
            failed: failedImports.length,
            details: {
                successful: importedClasses,
                errors: failedImports
            }
        };
    }
}

module.exports = ClassService; 