const { db } = require('../../../config/firebase');
const { toFirebaseFormat, toClientFormat } = require('../model/semester.model');
const ErrorResponse = require('../../../utils/errorResponse');

class SemesterRepository {
    constructor() {
        this.collection = db.collection('semester');
    }

    async findAll() {
        try {
            console.log('Fetching semesters from Firebase...');
            const snapshot = await this.collection.get();
            const semesters = snapshot.docs.map(doc => toClientFormat(doc));
            console.log('Semesters retrieved from Firebase:', semesters);
            return semesters;
        } catch (error) {
            console.error('Error in SemesterRepository.findAll:', error);
            throw new ErrorResponse('Error fetching semesters', 500);
        }
    }

    async findById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Semester not found', 404);
            }
            return toClientFormat(doc);
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error fetching semester', 500);
        }
    }

    async create(data) {
        try {
            const docRef = await this.collection.add(toFirebaseFormat(data));
            const newDoc = await docRef.get();
            return toClientFormat(newDoc);
        } catch (error) {
            throw new ErrorResponse('Error creating semester', 500);
        }
    }

    async update(id, data) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Semester not found', 404);
            }
            await this.collection.doc(id).update(toFirebaseFormat(data));
            const updatedDoc = await this.collection.doc(id).get();
            return toClientFormat(updatedDoc);
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error updating semester', 500);
        }
    }

    async delete(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Semester not found', 404);
            }
            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error deleting semester', 500);
        }
    }

    async findByName(semesterName) {
        try {
            const snapshot = await this.collection
                .where('semesterName', '==', semesterName)
                .get();
            return snapshot.docs.map(doc => toClientFormat(doc));
        } catch (error) {
            throw new ErrorResponse('Error finding semester by name', 500);
        }
    }
}

module.exports = SemesterRepository; 