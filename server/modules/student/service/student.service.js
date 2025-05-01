const { db } = require('../../../config/firebase');
const xlsx = require('xlsx');
const imageService = require('./image.service');
const cloudinary = require('cloudinary').v2;
const { validateStudent } = require('../validation/student.validation');
const { StudentRepository } = require('../repository/student.repository');
const ErrorResponse = require('../../../utils/errorResponse');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class StudentService {
    constructor() {
        this.studentRepository = new StudentRepository();
    }

    // Helper method to convert Firebase data to client format
    _convertToClientFormat(doc) {
        const data = doc.data();
        const profile = data.studentProfile || {};
        const documents = data.studentDocument || {};

        const rawStudent = {
            id: doc.id,
            firstName: profile.name ? profile.name.split(' ').pop() : '',
            lastName: profile.name ? profile.name.split(' ').slice(0, -1).join(' ') : '',
            class: profile.class || '',
            parentName: profile.fatherFullname || '',
            parentContact: profile.parentContact || '',
            gender: profile.gender || '',
            dateOfBirth: profile.dateOfBirth || '',
            school: profile.school || '',
            gradeLevel: profile.gradeLevel || '',
            educationSystem: profile.educationSystem || '',
            studentID: profile.studentID || '',
            motherName: profile.motherFullname || '',
            fatherOccupation: profile.fatherOccupation || '',
            motherOccupation: profile.motherOccupation || '',
            studentDocument: {
                image: documents.image || '',
                birthCertificate: documents.birthCertificate || '',
                householdRegistration: documents.householdRegistration || ''
            }
        };

        // Process images using ImageService
        return imageService.processStudentImages(rawStudent);
    }

    // Helper method to convert client data to Firebase format
    _convertToFirebaseFormat(studentData) {
        const fullName = `${studentData.lastName} ${studentData.firstName}`.trim();
        return {
            studentProfile: {
                name: fullName,
                class: studentData.class,
                fatherFullname: studentData.parentName,
                parentContact: studentData.parentContact,
                gender: studentData.gender,
                dateOfBirth: studentData.dateOfBirth,
                school: studentData.school,
                gradeLevel: studentData.gradeLevel,
                educationSystem: studentData.educationSystem,
                studentID: studentData.studentID,
                motherFullname: studentData.motherName,
                fatherOccupation: studentData.fatherOccupation,
                motherOccupation: studentData.motherOccupation
            },
            studentDocument: {
                image: studentData.image || '',
                birthCertificate: studentData.birthCertificate || '',
                householdRegistration: studentData.householdRegistration || ''
            }
        };
    }

    async getAllStudents() {
        try {
            if (!db) {
                throw new Error('Firebase database connection not initialized');
            }

            const studentsRef = db.collection('student');
            const snapshot = await studentsRef.get();

            if (snapshot.empty) {
                return [];
            }

            const students = [];
            snapshot.forEach(doc => {
                try {
                    const converted = this._convertToClientFormat(doc);
                    students.push(converted);
                } catch (docError) {
                    // Skip invalid documents
                }
            });

            return students;
        } catch (error) {
            throw error;
        }
    }

    async getStudentById(id) {
        try {
            const studentDoc = await db.collection('student').doc(id).get();
            if (!studentDoc.exists) {
                throw new Error('Student not found');
            }
            return this._convertToClientFormat(studentDoc);
        } catch (error) {
            throw error;
        }
    }

    async createStudent(studentData) {
        // Validate student data
        const { error } = validateStudent(studentData);
        if (error) {
            throw new ErrorResponse(error.details[0].message, 400);
        }

        // Handle file uploads to Cloudinary
        const uploadPromises = [];
        const fileFields = ['studentPhoto', 'transcriptPhoto', 'householdRegistration'];

        for (const field of fileFields) {
            if (studentData[field]) {
                // Check if the field contains a data URL
                if (studentData[field].startsWith('data:')) {
                    uploadPromises.push(
                        cloudinary.uploader.upload(studentData[field], {
                            folder: `kindergarten/students/${field}s`,
                            resource_type: 'auto',
                            transformation: field === 'studentPhoto' ? [
                                { width: 500, height: 500, crop: "fill", gravity: "face" },
                                { quality: "auto" },
                                { fetch_format: "auto" }
                            ] : [
                                { quality: "auto" },
                                { fetch_format: "auto" }
                            ]
                        }).then(result => ({
                            field,
                            secure_url: result.secure_url,
                            public_id: result.public_id
                        }))
                    );
                }
            }
        }

        // Wait for all uploads to complete
        if (uploadPromises.length > 0) {
            const uploadResults = await Promise.all(uploadPromises);

            // Update student data with Cloudinary URLs and public IDs
            uploadResults.forEach(({ field, secure_url, public_id }) => {
                studentData[field] = {
                    url: secure_url,
                    public_id: public_id
                };
            });
        }

        // Create student in database
        return await this.studentRepository.create(studentData);
    }

    async updateStudent(id, studentData) {
        // Validate update data
        const { error } = validateStudent(studentData);
        if (error) {
            throw new ErrorResponse(error.details[0].message, 400);
        }

        const student = await this.studentRepository.findById(id);
        if (!student) {
            throw new ErrorResponse('Student not found', 404);
        }

        // Handle file updates
        const fileFields = ['studentPhoto', 'transcriptPhoto', 'householdRegistration'];
        const uploadPromises = [];

        for (const field of fileFields) {
            if (studentData[field] && studentData[field].startsWith('data:')) {
                // Delete old file if exists
                if (student[field] && student[field].public_id) {
                    await cloudinary.uploader.destroy(student[field].public_id);
                }

                // Upload new file
                uploadPromises.push(
                    cloudinary.uploader.upload(studentData[field], {
                        folder: `kindergarten/students/${field}s`,
                        resource_type: 'auto',
                        transformation: field === 'studentPhoto' ? [
                            { width: 500, height: 500, crop: "fill", gravity: "face" },
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ] : [
                            { quality: "auto" },
                            { fetch_format: "auto" }
                        ]
                    }).then(result => ({
                        field,
                        secure_url: result.secure_url,
                        public_id: result.public_id
                    }))
                );
            }
        }

        // Process file uploads
        if (uploadPromises.length > 0) {
            const uploadResults = await Promise.all(uploadPromises);
            uploadResults.forEach(({ field, secure_url, public_id }) => {
                studentData[field] = {
                    url: secure_url,
                    public_id: public_id
                };
            });
        }

        return await this.studentRepository.update(id, studentData);
    }

    async deleteStudent(id) {
        const student = await this.studentRepository.findById(id);
        if (!student) {
            throw new ErrorResponse('Student not found', 404);
        }

        // Delete photos from Cloudinary
        const documents = [student.studentPhoto, student.transcriptPhoto, student.householdRegistration];
        for (const doc of documents) {
            if (doc && doc.public_id) {
                await cloudinary.uploader.destroy(doc.public_id);
            }
        }

        return await this.studentRepository.delete(id);
    }

    async importStudents(data) {
        try {
            const batch = db.batch();
            const studentsRef = db.collection('student');

            for (const student of data) {
                const firebaseData = this._convertToFirebaseFormat(student);
                const docRef = studentsRef.doc();
                batch.set(docRef, firebaseData);
            }

            await batch.commit();
            return true;
        } catch (error) {
            throw error;
        }
    }

    async exportStudentsToJson() {
        try {
            const students = await this.getAllStudents();
            return students;
        } catch (error) {
            throw error;
        }
    }

    async exportStudentsToExcel() {
        try {
            const students = await this.getAllStudents();
            const exportData = students.map(student => ({
                'Student ID': student.studentID,
                'First Name': student.firstName,
                'Last Name': student.lastName,
                'Class': student.class,
                'School': student.school,
                'Education System': student.educationSystem,
                'Grade Level': student.gradeLevel,
                'Gender': student.gender,
                'Date of Birth': student.dateOfBirth,
                'Father Name': student.parentName,
                'Father Occupation': student.fatherOccupation,
                'Mother Name': student.motherName,
                'Mother Occupation': student.motherOccupation,
                'Contact': student.parentContact
            }));

            const worksheet = xlsx.utils.json_to_sheet(exportData);
            const workbook = xlsx.utils.book_new();
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Students');

            return xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        } catch (error) {
            throw error;
        }
    }

    async getStudentsByClass(className) {
        try {
            const studentsRef = db.collection('student');
            const snapshot = await studentsRef
                .where('studentProfile.class', '==', className)
                .get();
            return snapshot.docs.map(doc => this._convertToClientFormat(doc));
        } catch (error) {
            throw error;
        }
    }

    async searchStudents(searchTerm) {
        try {
            const students = await this.getAllStudents();
            const searchTermLower = searchTerm.toLowerCase();

            return students.filter(student =>
                student.firstName.toLowerCase().includes(searchTermLower) ||
                student.lastName.toLowerCase().includes(searchTermLower) ||
                student.parentName.toLowerCase().includes(searchTermLower) ||
                student.class.toLowerCase().includes(searchTermLower) ||
                student.studentID.toLowerCase().includes(searchTermLower) ||
                student.school.toLowerCase().includes(searchTermLower)
            );
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { StudentService }; 