const { db } = require('../../../config/firebase');
const { toClientFormat, toFirebaseFormat } = require('../model/class.model');
const ErrorResponse = require('../../../utils/errorResponse');

class ClassRepository {
    constructor() {
        this.collection = db.collection('classes');
        console.log('ClassRepository initialized with collection: classes');
    }

    async findAll() {
        try {
            console.log('Attempting to fetch classes from collection: classes');
            const snapshot = await this.collection.get();
            console.log('Firestore response received. Number of documents:', snapshot.size);

            if (snapshot.empty) {
                console.log('No documents found in collection');
                return [];
            }

            const results = snapshot.docs.map(doc => {
                try {
                    const data = toClientFormat(doc);
                    console.log('Processed document:', { id: doc.id, data: doc.data() });
                    return data;
                } catch (err) {
                    console.error('Error processing document:', { id: doc.id, error: err.message });
                    return null;
                }
            }).filter(Boolean);

            console.log('Successfully processed documents:', results.length);
            return results;
        } catch (error) {
            console.error('Error in ClassRepository.findAll:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            throw new ErrorResponse(`Error fetching classes: ${error.message}`, 500);
        }
    }

    async findById(id) {
        try {
            const doc = await this.collection.doc(id).get();
            if (!doc.exists) {
                throw new ErrorResponse('Class not found', 404);
            }
            return toClientFormat(doc);
        } catch (error) {
            if (error.status === 404) throw error;
            throw new ErrorResponse('Error fetching class', 500);
        }
    }

    async create(classData) {
        try {
            const data = toFirebaseFormat(classData);
            const docRef = await this.collection.add(data);
            const newDoc = await docRef.get();
            return toClientFormat(newDoc);
        } catch (error) {
            throw new ErrorResponse('Error creating class', 500);
        }
    }

    async update(id, classData) {
        try {
            const data = toFirebaseFormat(classData);
            await this.collection.doc(id).update(data);
            const updatedDoc = await this.collection.doc(id).get();
            return toClientFormat(updatedDoc);
        } catch (error) {
            throw new ErrorResponse('Error updating class', 500);
        }
    }

    async delete(id) {
        try {
            await this.collection.doc(id).delete();
            return true;
        } catch (error) {
            throw new ErrorResponse('Error deleting class', 500);
        }
    }

    async findByName(className) {
        try {
            const snapshot = await this.collection
                .where('className', '==', className)
                .get();
            return snapshot.docs.map(doc => toClientFormat(doc));
        } catch (error) {
            throw new ErrorResponse('Error finding class by name', 500);
        }
    }
}

module.exports = ClassRepository; 