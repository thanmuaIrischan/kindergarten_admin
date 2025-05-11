const { db } = require('../../../config/firebase');
const xlsx = require('xlsx');
const imageService = require('./image.service');
const cloudinary = require('cloudinary').v2;
const { validateStudent } = require('../validation/student.validation');
const { StudentRepository } = require('../repository/student.repository');
const ErrorResponse = require('../../../utils/errorResponse');
const XLSX = require('xlsx');
const { studentModel, toFirebaseFormat } = require('../model/student.model');
const ExcelJS = require('exceljs');

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

    async importStudents(file) {
        try {
            console.log('Starting import process...');
            
            if (!file) {
                throw new Error('No file provided');
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            
            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) {
                throw new Error('No worksheet found in the Excel file');
            }

            const students = [];
            let rowCount = 0;

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return; // Skip header row

                const student = {
                    studentProfile: {
                        studentID: row.getCell('studentID').value?.toString() || '',
                        firstName: row.getCell('firstName').value?.toString() || '',
                        lastName: row.getCell('lastName').value?.toString() || '',
                        name: row.getCell('name').value?.toString() || '',
                        dateOfBirth: row.getCell('dateOfBirth').value?.toString() || '',
                        gender: row.getCell('gender').value?.toString() || '',
                        gradeLevel: row.getCell('gradeLevel').value?.toString() || '',
                        school: row.getCell('school').value?.toString() || '',
                        class: row.getCell('class').value?.toString() || '',
                        educationSystem: row.getCell('educationSystem').value?.toString() || '',
                        fatherFullname: row.getCell('fatherName').value?.toString() || '',
                        fatherOccupation: row.getCell('fatherOccupation').value?.toString() || '',
                        motherFullname: row.getCell('motherName').value?.toString() || '',
                        motherOccupation: row.getCell('motherOccupation').value?.toString() || ''
                    },
                    studentDocument: {
                        image: row.getCell('image').value?.toString() || '',
                        birthCertificate: row.getCell('birthCertificate').value?.toString() || '',
                        householdRegistration: row.getCell('householdRegistration').value?.toString() || ''
                    }
                };

                students.push(student);
                rowCount++;
            });

            console.log(`Processed ${rowCount} rows from Excel file`);

            if (students.length === 0) {
                throw new Error('No valid student data found in the file');
            }

            // Batch write to Firebase
            const batch = db.batch();
            students.forEach(student => {
                const docRef = db.collection('student').doc();
                batch.set(docRef, student);
            });

            await batch.commit();
            console.log(`Successfully imported ${students.length} students`);

            return {
                success: true,
                count: students.length
            };
        } catch (error) {
            console.error('Error in importStudents:', error);
            throw new Error('Failed to import students: ' + error.message);
        }
    }

    async exportStudents(format, students) {
        try {
            console.log('Starting export process...');
            
            if (!Array.isArray(students)) {
                throw new Error('No students data provided');
            }

            console.log(`Processing ${students.length} students for export`);

            if (format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Students');

                // Set up columns with proper headers
                worksheet.columns = [
                    { header: 'Student ID', key: 'studentID', width: 15 },
                    { header: 'First Name', key: 'firstName', width: 20 },
                    { header: 'Last Name', key: 'lastName', width: 20 },
                    { header: 'Full Name', key: 'name', width: 30 },
                    { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
                    { header: 'Gender', key: 'gender', width: 10 },
                    { header: 'Grade Level', key: 'gradeLevel', width: 15 },
                    { header: 'School', key: 'school', width: 30 },
                    { header: 'Class', key: 'class', width: 15 },
                    { header: 'Education System', key: 'educationSystem', width: 20 },
                    { header: 'Father\'s Name', key: 'fatherName', width: 30 },
                    { header: 'Father\'s Occupation', key: 'fatherOccupation', width: 30 },
                    { header: 'Mother\'s Name', key: 'motherName', width: 30 },
                    { header: 'Mother\'s Occupation', key: 'motherOccupation', width: 30 },
                    { header: 'Image', key: 'image', width: 30 },
                    { header: 'Birth Certificate', key: 'birthCertificate', width: 30 },
                    { header: 'Household Registration', key: 'householdRegistration', width: 30 }
                ];

                // Add rows
                students.forEach(student => {
                    worksheet.addRow({
                        studentID: student.studentID || '',
                        firstName: student.firstName || '',
                        lastName: student.lastName || '',
                        name: student.name || '',
                        dateOfBirth: student.dateOfBirth || '',
                        gender: student.gender || '',
                        gradeLevel: student.gradeLevel || '',
                        school: student.school || '',
                        class: student.class || '',
                        educationSystem: student.educationSystem || '',
                        fatherName: student.fatherName || '',
                        fatherOccupation: student.fatherOccupation || '',
                        motherName: student.motherName || '',
                        motherOccupation: student.motherOccupation || '',
                        image: student.image || '',
                        birthCertificate: student.birthCertificate || '',
                        householdRegistration: student.householdRegistration || ''
                    });
                });

                // Style the header row
                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };

                // Generate buffer
                const buffer = await workbook.xlsx.writeBuffer();
                return buffer;
            } else if (format === 'json') {
                return JSON.stringify(students, null, 2);
            } else {
                throw new Error('Invalid export format');
            }
        } catch (error) {
            console.error('Error in exportStudents service:', error);
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