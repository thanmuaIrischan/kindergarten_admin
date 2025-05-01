const { db } = require('../../../config/firebase');
const { toFirebaseFormat, toClientFormat } = require('../model/student.model');
const ErrorResponse = require('../../../utils/errorResponse');
const cloudinary = require('cloudinary').v2;

class StudentRepository {
    constructor() {
        this.collection = db.collection('student');
    }

    async create(studentData) {
        try {
            const data = toFirebaseFormat(studentData);
            const docRef = await this.collection.add(data);
            const doc = await docRef.get();
            return toClientFormat(doc);
        } catch (error) {
            throw new ErrorResponse('Error creating student', 500);
        }
    }

    async findById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Student not found', 404);
            }
            return toClientFormat(doc);
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error finding student', 500);
        }
    }

    async findAll() {
        try {
            const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => toClientFormat(doc));
        } catch (error) {
            throw new ErrorResponse('Error fetching students', 500);
        }
    }

    async update(id, updateData) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Student not found', 404);
            }

            const currentData = doc.data();
            const updatedData = toFirebaseFormat({
                ...toClientFormat(doc),
                ...updateData
            });

            await this.collection.doc(id).update(updatedData);
            const updatedDoc = await this.collection.doc(id).get();
            return toClientFormat(updatedDoc);
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error updating student', 500);
        }
    }

    async delete(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Student not found', 404);
            }

            // Delete associated Cloudinary files
            const data = doc.data();
            const documents = [
                data.studentDocument?.studentPhoto,
                data.studentDocument?.transcriptPhoto,
                data.studentDocument?.householdRegistration
            ];

            for (const doc of documents) {
                if (doc && doc.public_id) {
                    await cloudinary.uploader.destroy(doc.public_id);
                }
            }

            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error deleting student', 500);
        }
    }

    async findByClass(className) {
        try {
            const snapshot = await this.collection
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

            const snapshot = await this.collection.get();
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