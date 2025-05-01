const { db } = require('../../../config/firebase');

class ClassService {
    async getAllClasses() {
        try {
            const classesRef = db.collection('classes');
            const snapshot = await classesRef.get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            throw error;
        }
    }

    async getClassById(id) {
        try {
            const doc = await db.collection('classes').doc(id).get();
            if (!doc.exists) {
                throw new Error('Class not found');
            }
            return {
                id: doc.id,
                ...doc.data()
            };
        } catch (error) {
            throw error;
        }
    }

    async createClass(classData) {
        try {
            // Validate required fields
            if (!classData.name || !classData.teacher || !classData.capacity) {
                throw new Error('Name, teacher, and capacity are required fields');
            }

            const docRef = await db.collection('classes').add(classData);
            return {
                id: docRef.id,
                ...classData
            };
        } catch (error) {
            throw error;
        }
    }

    async updateClass(id, classData) {
        try {
            await db.collection('classes').doc(id).update(classData);
            return {
                id,
                ...classData
            };
        } catch (error) {
            throw error;
        }
    }

    async deleteClass(id) {
        try {
            // Check if there are any students in this class
            const studentsRef = db.collection('students');
            const studentsSnapshot = await studentsRef.where('class', '==', id).limit(1).get();

            if (!studentsSnapshot.empty) {
                throw new Error('Cannot delete class with enrolled students');
            }

            await db.collection('classes').doc(id).delete();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async getClassStudentCount(classId) {
        try {
            const studentsRef = db.collection('students');
            const studentsSnapshot = await studentsRef.where('class', '==', classId).get();
            return studentsSnapshot.size;
        } catch (error) {
            throw error;
        }
    }

    async getClassesWithStudentCount() {
        try {
            const classes = await this.getAllClasses();
            const classesWithCount = await Promise.all(
                classes.map(async (cls) => {
                    const studentCount = await this.getClassStudentCount(cls.id);
                    return {
                        ...cls,
                        studentCount
                    };
                })
            );
            return classesWithCount;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new ClassService(); 