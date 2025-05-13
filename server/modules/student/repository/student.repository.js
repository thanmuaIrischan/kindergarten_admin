const { db } = require('../../../config/firebase');
const { toFirebaseFormat, toClientFormat } = require('../model/student.model');
const ErrorResponse = require('../../../utils/errorResponse');
const cloudinary = require('cloudinary').v2;

class StudentRepository {
    constructor() {
        this.collection = 'student';
    }

    async findById(id) {
        try {
            const doc = await db.collection(this.collection).doc(id).get();
            return doc.exists ? doc : null;
        } catch (error) {
            throw new ErrorResponse('Error finding student', 500);
        }
    }

    async create(studentData) {
        try {
            const docRef = db.collection(this.collection).doc(studentData.studentProfile.studentID);
            await docRef.set(studentData);
            return docRef;
        } catch (error) {
            throw new ErrorResponse('Error creating student', 500);
        }
    }

    async update(id, studentData) {
        try {
            const docRef = db.collection(this.collection).doc(id);
            await docRef.update(studentData);
            return docRef;
        } catch (error) {
            throw new ErrorResponse('Error updating student', 500);
        }
    }

    async delete(id) {
        try {
            const docRef = db.collection(this.collection).doc(id);
            await docRef.delete();
            return true;
        } catch (error) {
            throw new ErrorResponse('Error deleting student', 500);
        }
    }

    async findAll() {
        try {
            const snapshot = await db.collection(this.collection).get();
            return snapshot.docs;
        } catch (error) {
            throw new ErrorResponse('Error finding students', 500);
        }
    }

    async findByClass(className) {
        try {
            const snapshot = await db.collection(this.collection)
                .where('studentProfile.class', '==', className)
                .orderBy('studentProfile.lastName')
                .orderBy('studentProfile.firstName')
                .get();
            return snapshot.docs.map(doc => toClientFormat(doc));
        } catch (error) {
            throw new ErrorResponse('Error finding students by class', 500);
        }
    }

    async search(term) {
        try {
            if (!term) return [];

            const snapshot = await db.collection(this.collection).get();
            const searchTermLower = term.toLowerCase();

            return snapshot.docs
                .map(doc => toClientFormat(doc))
                .filter(student =>
                    student.firstName.toLowerCase().includes(searchTermLower) ||
                    student.lastName.toLowerCase().includes(searchTermLower) ||
                    student.parentName.toLowerCase().includes(searchTermLower) ||
                    student.class.toLowerCase().includes(searchTermLower) ||
                    student.parentEmail.toLowerCase().includes(searchTermLower)
                );
        } catch (error) {
            throw new ErrorResponse('Error searching students', 500);
        }
    }
}

module.exports = { StudentRepository }; 