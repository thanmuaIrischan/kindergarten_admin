const { db } = require('../../../config/firebase');
const { toClientFormat, toFirebaseFormat } = require('../model/class.model');
const ErrorResponse = require('../../../utils/errorResponse');
const TeacherRepository = require('../../teacher/repositories/teacher.repository');
const { FieldValue } = require('firebase-admin/firestore');

class ClassRepository {
    constructor() {
        this.collection = db.collection('classes');
        this.teacherRepository = new TeacherRepository();
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
                    const rawData = doc.data();
                    console.log('Processed document:', {
                        id: doc.id,
                        data: rawData,
                        studentCount: rawData.students ? rawData.students.length : 0
                    });
                    return {
                        ...data,
                        studentCount: rawData.students ? rawData.students.length : 0
                    };
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
            const formattedData = toClientFormat(doc);
            const rawData = doc.data();
            return {
                ...formattedData,
                studentCount: rawData.students ? rawData.students.length : 0
            };
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
            // Check if class exists
            const classDoc = await this.collection.doc(id).get();
            if (!classDoc.exists) {
                throw new ErrorResponse('Class not found', 404);
            }

            // If teacherID is being updated, verify the teacher exists
            if (classData.teacherID) {
                const teacher = await this.teacherRepository.findByTeacherId(classData.teacherID);
                if (!teacher) {
                    throw new ErrorResponse('Teacher not found', 404);
                }
            }

            const data = toFirebaseFormat(classData);
            await this.collection.doc(id).update(data);
            const updatedDoc = await this.collection.doc(id).get();
            return toClientFormat(updatedDoc);
        } catch (error) {
            if (error instanceof ErrorResponse) throw error;
            throw new ErrorResponse('Error updating class', 500);
        }
    }

    async updateTeacher(id, teacherID) {
        try {
            // Check if class exists
            const classDoc = await this.collection.doc(id).get();
            if (!classDoc.exists) {
                throw new ErrorResponse('Class not found', 404);
            }

            // Verify the new teacher exists if teacherID is provided
            if (teacherID) {
                const teacher = await this.teacherRepository.findByTeacherId(teacherID);
                if (!teacher) {
                    throw new ErrorResponse('Teacher not found', 404);
                }
            }

            // Get current class data
            const currentData = classDoc.data();

            // Create update data preserving all necessary fields
            const updateData = {
                teacherID: teacherID || null,
                className: currentData.className,
                students: currentData.students || [], // Preserve students array with studentIDs
                semesterID: currentData.semesterID || null // Preserve semesterID
            };

            // Remove any timestamp fields if they exist
            await this.collection.doc(id).update({
                updatedAt: FieldValue.delete(),
                createdAt: FieldValue.delete(),
                isTeacherChange: FieldValue.delete()
            });

            // Then update with the complete data
            const data = toFirebaseFormat(updateData);
            await this.collection.doc(id).update(data);

            const updatedDoc = await this.collection.doc(id).get();
            const formattedData = toClientFormat(updatedDoc);
            const rawData = updatedDoc.data();

            // Add studentCount to the response
            return {
                ...formattedData,
                studentCount: rawData.students ? rawData.students.length : 0
            };
        } catch (error) {
            if (error instanceof ErrorResponse) throw error;
            throw new ErrorResponse('Error updating class teacher', 500);
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