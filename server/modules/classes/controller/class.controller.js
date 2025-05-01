const classService = require('../service/class.service');

class ClassController {
    async getAllClasses(req, res) {
        try {
            const classes = await classService.getClassesWithStudentCount();
            res.json(classes);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch classes' });
        }
    }

    async getClassById(req, res) {
        try {
            const { id } = req.params;
            const classData = await classService.getClassById(id);
            res.json(classData);
        } catch (error) {
            res.status(404).json({ error: 'Class not found' });
        }
    }

    async createClass(req, res) {
        try {
            const classData = req.body;
            const newClass = await classService.createClass(classData);
            res.status(201).json(newClass);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async updateClass(req, res) {
        try {
            const { id } = req.params;
            const classData = req.body;
            const updatedClass = await classService.updateClass(id, classData);
            res.json(updatedClass);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async deleteClass(req, res) {
        try {
            const { id } = req.params;
            await classService.deleteClass(id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new ClassController(); 