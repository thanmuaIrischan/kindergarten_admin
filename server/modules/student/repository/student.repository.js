const { db } = require('../../../config/firebase');
const ErrorResponse = require('../../../utils/errorResponse');
const { toFirebaseFormat, toClientFormat } = require('../model/student.model');

class StudentRepository {
    constructor() {
        this.collection = 'student';
    }

    async findById(id) {
        try {
            const doc = await db.collection(this.collection).doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse(`Student with ID ${id} not found`, 404);
            }
            return toClientFormat(doc);
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error finding student: ${error.message}`, 500);
        }
    }

    async create(studentData) {
        try {
            console.log('Repository received data:', studentData); // Debug log

            // Validate required fields in studentProfile
            if (!studentData.studentProfile || !studentData.studentProfile.studentID) {
                throw new ErrorResponse('studentID is required', 400);
            }
            if (!studentData.studentProfile.name) {
                throw new ErrorResponse('name is required', 400);
            }
            if (!studentData.studentProfile.class) {
                throw new ErrorResponse('class is required', 400);
            }

            const docRef = db.collection(this.collection).doc();
            await docRef.set(studentData); // Use the data directly as it's already in the correct format
            return { id: docRef.id };
        } catch (error) {
            console.error('Repository create error:', error); // Debug log
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error creating student: ${error.message}`, 500);
        }
    }

    async update(id, studentData) {
        try {
            const docRef = db.collection(this.collection).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new ErrorResponse(`Student with ID ${id} not found`, 404);
            }
            const updatedData = toFirebaseFormat({ ...doc.data(), ...studentData });
            await docRef.set(updatedData, { merge: true });
            return { id };
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error updating student: ${error.message}`, 500);
        }
    }

    async delete(id) {
        try {
            const docRef = db.collection(this.collection).doc(id);
            const doc = await docRef.get();
            if (!doc.exists) {
                throw new ErrorResponse(`Student with ID ${id} not found`, 404);
            }
            await docRef.delete();
            return true;
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error deleting student: ${error.message}`, 500);
        }
    }

    async findAll({ page = 1, limit = 10 } = {}) {
        try {
            const snapshot = await db.collection(this.collection)
                .orderBy('studentProfile.name')
                .offset((page - 1) * limit)
                .limit(limit)
                .get();
            return snapshot.docs.map(doc => toClientFormat(doc));
        } catch (error) {
            throw new ErrorResponse(`Error finding students: ${error.message}`, 500);
        }
    }

    async findByClass(classId) {
        try {
            const snapshot = await db.collection(this.collection)
                .where('studentProfile.class', '==', classId)
                .orderBy('studentProfile.name')
                .get();
            return snapshot.docs.map(doc => toClientFormat(doc));
        } catch (error) {
            throw new ErrorResponse(`Error finding students by class: ${error.message}`, 500);
        }
    }

    async search(term) {
        try {
            if (!term) return [];

            const snapshot = await db.collection(this.collection)
                .where('studentProfile.name', '>=', term)
                .where('studentProfile.name', '<=', term + '\uf8ff')
                .limit(50)
                .get();

            const searchTermLower = term.toLowerCase();
            return snapshot.docs
                .map(doc => toClientFormat(doc))
                .filter(student =>
                    student.name.toLowerCase().includes(searchTermLower) ||
                    student.studentID.toLowerCase().includes(searchTermLower) ||
                    student.fatherFullname.toLowerCase().includes(searchTermLower) ||
                    student.motherFullname.toLowerCase().includes(searchTermLower) ||
                    student.class.toLowerCase().includes(searchTermLower) ||
                    student.school.toLowerCase().includes(searchTermLower)
                );
        } catch (error) {
            throw new ErrorResponse(`Error searching students: ${error.message}`, 500);
        }
    }
}

module.exports = { StudentRepository };