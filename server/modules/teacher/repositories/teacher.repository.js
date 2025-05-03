const { db } = require('../../../config/firebase');
const { format } = require('date-fns');
const teacherCollection = 'teacher';

class TeacherRepository {
    async findAll() {
        try {
            const snapshot = await db.collection(teacherCollection).get();
            return snapshot.docs.map(doc => ({
                id: doc.id,
                firstName: doc.data().firstName || '',
                lastName: doc.data().lastName || '',
                teacherID: doc.data().teacherID || '',
                gender: doc.data().gender || '',
                phone: doc.data().phone || '',
                dateOfBirth: doc.data().dateOfBirth || '',
                avatar: doc.data().avatar || ''
            }));
        } catch (error) {
            throw new Error(`Error fetching teachers: ${error.message}`);
        }
    }

    async findById(id) {
        try {
            const doc = await db.collection(teacherCollection).doc(id).get();
            if (!doc.exists) {
                throw new Error('Teacher not found');
            }
            const data = doc.data();
            return {
                id: doc.id,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                teacherID: data.teacherID || '',
                gender: data.gender || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth || '',
                avatar: data.avatar || ''
            };
        } catch (error) {
            throw new Error(`Error fetching teacher: ${error.message}`);
        }
    }

    async create(teacherData) {
        try {
            // Validate required fields
            this.validateTeacherData(teacherData);

            // Check for duplicate teacher ID
            const existingTeacher = await this.findByTeacherId(teacherData.teacherID);
            if (existingTeacher) {
                throw new Error('Teacher ID already exists');
            }

            // Strictly control what fields are saved to Firebase
            const allowedFields = {
                firstName: teacherData.firstName.trim(),
                lastName: teacherData.lastName.trim(),
                teacherID: teacherData.teacherID.trim(),
                gender: teacherData.gender,
                phone: teacherData.phone.trim(),
                dateOfBirth: format(new Date(teacherData.dateOfBirth), 'dd-MM-yyyy'),
                avatar: teacherData.avatar ? teacherData.avatar.trim() : ''
            };

            const docRef = await db.collection(teacherCollection).add(allowedFields);
            const newDoc = await docRef.get();
            const data = newDoc.data();

            return {
                id: newDoc.id,
                ...allowedFields
            };
        } catch (error) {
            throw new Error(`Error creating teacher: ${error.message}`);
        }
    }

    async update(id, teacherData) {
        try {
            // Check if teacher exists
            const doc = await db.collection(teacherCollection).doc(id).get();
            if (!doc.exists) {
                throw new Error('Teacher not found');
            }

            // Validate required fields
            this.validateTeacherData(teacherData);

            // Check for duplicate teacher ID if changed
            if (teacherData.teacherID !== doc.data().teacherID) {
                const existingTeacher = await this.findByTeacherId(teacherData.teacherID);
                if (existingTeacher) {
                    throw new Error('Teacher ID already exists');
                }
            }

            // Strictly control what fields are updated
            const allowedFields = {
                firstName: teacherData.firstName.trim(),
                lastName: teacherData.lastName.trim(),
                teacherID: teacherData.teacherID.trim(),
                gender: teacherData.gender,
                phone: teacherData.phone.trim(),
                dateOfBirth: format(new Date(teacherData.dateOfBirth), 'dd-MM-yyyy'),
                avatar: teacherData.avatar ? teacherData.avatar.trim() : ''
            };

            await db.collection(teacherCollection).doc(id).set(allowedFields, { merge: false });

            return {
                id,
                ...allowedFields
            };
        } catch (error) {
            throw new Error(`Error updating teacher: ${error.message}`);
        }
    }

    async delete(id) {
        try {
            const doc = await db.collection(teacherCollection).doc(id).get();
            if (!doc.exists) {
                throw new Error('Teacher not found');
            }
            await db.collection(teacherCollection).doc(id).delete();
            return { id };
        } catch (error) {
            throw new Error(`Error deleting teacher: ${error.message}`);
        }
    }

    async search(query) {
        try {
            const snapshot = await db.collection(teacherCollection).get();
            return snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    teacherID: data.teacherID || '',
                    gender: data.gender || '',
                    phone: data.phone || '',
                    dateOfBirth: data.dateOfBirth || '',
                    avatar: data.avatar || ''
                };
            }).filter(teacher =>
                teacher.firstName.toLowerCase().includes(query.toLowerCase()) ||
                teacher.lastName.toLowerCase().includes(query.toLowerCase()) ||
                teacher.teacherID.toLowerCase().includes(query.toLowerCase()) ||
                teacher.phone.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            throw new Error(`Error searching teachers: ${error.message}`);
        }
    }

    async findByTeacherId(teacherID) {
        try {
            const snapshot = await db.collection(teacherCollection)
                .where('teacherID', '==', teacherID)
                .get();

            if (snapshot.empty) {
                return null;
            }

            const doc = snapshot.docs[0];
            const data = doc.data();
            return {
                id: doc.id,
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                teacherID: data.teacherID || '',
                gender: data.gender || '',
                phone: data.phone || '',
                dateOfBirth: data.dateOfBirth || '',
                avatar: data.avatar || ''
            };
        } catch (error) {
            throw new Error(`Error finding teacher by ID: ${error.message}`);
        }
    }

    validateTeacherData(data) {
        const requiredFields = ['firstName', 'lastName', 'teacherID', 'gender', 'phone', 'dateOfBirth'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        // Validate phone number format
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(data.phone)) {
            throw new Error('Invalid phone number format');
        }

        // Validate date of birth
        const dob = new Date(data.dateOfBirth);
        if (isNaN(dob.getTime())) {
            throw new Error('Invalid date of birth');
        }

        // Validate gender
        const validGenders = ['Male', 'Female'];
        if (!validGenders.includes(data.gender)) {
            throw new Error('Invalid gender value');
        }

        // Validate teacher ID format (assuming it should be alphanumeric)
        const teacherIdRegex = /^[A-Za-z0-9-]+$/;
        if (!teacherIdRegex.test(data.teacherID)) {
            throw new Error('Invalid teacher ID format');
        }
    }

    mapTeacherData(doc) {
        const data = doc.data();
        return {
            id: doc.id,
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            teacherID: data.teacherID || '',
            gender: data.gender || '',
            phone: data.phone || '',
            dateOfBirth: data.dateOfBirth || '',
            avatar: data.avatar || ''
        };
    }

    async importTeachers(teachers) {
        const results = {
            imported: 0,
            failed: 0,
            duplicates: 0,
            details: {
                successful: [],
                errors: []
            }
        };

        try {
            // Process teachers in batches to avoid overwhelming Firestore
            const batch = db.batch();
            let operationCount = 0;
            const maxBatchSize = 500; // Firestore batch limit

            for (const teacher of teachers) {
                try {
                    // Validate required fields
                    if (!this.validateImportData(teacher)) {
                        results.failed++;
                        results.details.errors.push({
                            teacherID: teacher.teacherID || 'Unknown',
                            error: 'Missing required fields'
                        });
                        continue;
                    }

                    // Check for duplicate teacher ID
                    const existingTeacher = await this.findByTeacherId(teacher.teacherID);
                    if (existingTeacher) {
                        results.duplicates++;
                        results.details.errors.push({
                            teacherID: teacher.teacherID,
                            error: 'Teacher ID already exists'
                        });
                        continue;
                    }

                    // Prepare teacher data
                    const teacherData = {
                        firstName: teacher.firstName.trim(),
                        lastName: teacher.lastName.trim(),
                        teacherID: teacher.teacherID.trim(),
                        gender: teacher.gender,
                        phone: teacher.phone.trim(),
                        dateOfBirth: format(new Date(teacher.dateOfBirth), 'dd-MM-yyyy'),
                        avatar: teacher.avatar ? teacher.avatar.trim() : ''
                    };

                    // Add to batch
                    const docRef = db.collection(teacherCollection).doc();
                    batch.set(docRef, teacherData);
                    operationCount++;

                    // Track successful operation
                    results.details.successful.push({
                        id: docRef.id,
                        ...teacherData
                    });

                    // Commit batch if it reaches the size limit
                    if (operationCount === maxBatchSize) {
                        await batch.commit();
                        batch = db.batch();
                        operationCount = 0;
                    }

                    results.imported++;
                } catch (error) {
                    results.failed++;
                    results.details.errors.push({
                        teacherID: teacher.teacherID || 'Unknown',
                        error: error.message
                    });
                }
            }

            // Commit any remaining operations
            if (operationCount > 0) {
                await batch.commit();
            }

            return results;
        } catch (error) {
            throw new Error(`Error importing teachers: ${error.message}`);
        }
    }

    validateImportData(teacher) {
        return teacher &&
            typeof teacher.firstName === 'string' && teacher.firstName.trim() !== '' &&
            typeof teacher.lastName === 'string' && teacher.lastName.trim() !== '' &&
            typeof teacher.teacherID === 'string' && teacher.teacherID.trim() !== '' &&
            typeof teacher.gender === 'string' && teacher.gender.trim() !== '' &&
            typeof teacher.phone === 'string' && teacher.phone.trim() !== '' &&
            teacher.dateOfBirth;
    }

    async getPrintData(filters = {}) {
        try {
            let query = db.collection(teacherCollection);

            // Apply filters if provided
            if (filters.searchTerm) {
                const searchTerm = filters.searchTerm.toLowerCase();
                const snapshot = await query.get();
                return snapshot.docs
                    .map(doc => this.mapTeacherData(doc))
                    .filter(teacher =>
                        teacher.firstName.toLowerCase().includes(searchTerm) ||
                        teacher.lastName.toLowerCase().includes(searchTerm) ||
                        teacher.teacherID.toLowerCase().includes(searchTerm) ||
                        teacher.phone.toLowerCase().includes(searchTerm)
                    );
            }

            // Get all teachers if no filters
            const snapshot = await query.get();
            const teachers = snapshot.docs.map(doc => this.mapTeacherData(doc));

            // Sort teachers by name
            return teachers.sort((a, b) => {
                const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
                const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } catch (error) {
            throw new Error(`Error getting print data: ${error.message}`);
        }
    }
}

module.exports = TeacherRepository; 