const { db } = require('../../../config/firebase');
const ExcelJS = require('exceljs');
const cloudinary = require('cloudinary').v2;
const { validateStudent } = require('../validation/student.validation');
const { StudentRepository } = require('../repository/student.repository');
const { toFirebaseFormat } = require('../model/student.model');
const ErrorResponse = require('../../../utils/errorResponse');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

class StudentService {
    constructor() {
        this.studentRepository = new StudentRepository();
    }

    async getAllStudents({ page = 1, limit = 10 } = {}) {
        try {
            const students = await this.studentRepository.findAll({ page, limit });
            return students;
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error retrieving students: ${error.message}`, 500);
        }
    }

    async getStudentById(id) {
        try {
            const student = await this.studentRepository.findById(id);
            return student;
        } catch (error) {
            throw error;
        }
    }

    async createStudent(studentData) {
        try {
            const { error } = validateStudent(studentData.studentProfile, 'create');
            if (error) {
                throw new ErrorResponse(error.details.map(e => e.message).join(', '), 400);
            }

            const snapshot = await db.collection('student')
                .where('studentProfile.studentID', '==', studentData.studentProfile.studentID)
                .get();
            if (!snapshot.empty) {
                throw new ErrorResponse('Student ID already exists', 400);
            }

            const studentRef = await this.studentRepository.create(studentData);
            return studentRef;
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error creating student: ${error.message}`, 500);
        }
    }

    async updateStudent(id, studentData) {
        try {
            // Convert gradeLevel to number if it is a string
            if (studentData.gradeLevel && typeof studentData.gradeLevel === 'string' && !isNaN(studentData.gradeLevel)) {
                studentData.gradeLevel = Number(studentData.gradeLevel);
            }
            
            const { error } = validateStudent(studentData, 'update');
            if (error) {
                throw new ErrorResponse(error.details.map(e => e.message).join(', '), 400);
            }

            const student = await this.studentRepository.findById(id);
            console.log("student after findByID", student);
            const formattedData = toFirebaseFormat(studentData);
            console.log("Formatted data", formattedData);

            const fileFields = ['image', 'birthCertificate', 'householdRegistration'];
            const uploadPromises = [];

            for (const field of fileFields) {
                if (studentData[field] && typeof studentData[field] === 'string' && studentData[field].startsWith('data:')) {
                    const mimeMatch = studentData[field].match(/^data:(image\/[a-z]+|application\/pdf);base64,/);
                    if (!mimeMatch) {
                        throw new ErrorResponse(`Invalid file format for ${field}`, 400);
                    }

                    if (student.studentDocument[field]) {
                        await cloudinary.uploader.destroy(student.studentDocument[field]);
                    }

                    uploadPromises.push(
                        cloudinary.uploader.upload(studentData[field], {
                            folder: `kindergarten/students/${field}`,
                            resource_type: 'auto',
                            transformation: field === 'image' ? [
                                { width: 500, height: 500, crop: 'fill', gravity: 'face' },
                                { quality: 'auto' },
                                { fetch_format: 'auto' }
                            ] : [
                                { quality: 'auto' },
                                { fetch_format: 'auto' }
                            ]
                        }).then(result => ({
                            field,
                            public_id: result.public_id
                        }))
                    );
                }
            }

            if (uploadPromises.length > 0) {
                const uploadResults = await Promise.all(uploadPromises);
                uploadResults.forEach(({ field, public_id }) => {
                    formattedData.studentDocument[field] = public_id;
                });
            }

            return await this.studentRepository.update(id, formattedData);
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error updating student: ${error.message}`, 500);
        }
    }

    async deleteStudent(id) {
        try {
            const student = await this.studentRepository.findById(id);

            const documents = [
                student.studentDocument.image,
                student.studentDocument.birthCertificate,
                student.studentDocument.householdRegistration
            ];
            for (const public_id of documents) {
                if (public_id) {
                    await cloudinary.uploader.destroy(public_id);
                }
            }

            return await this.studentRepository.delete(id);
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error deleting student: ${error.message}`, 500);
        }
    }

    async importStudents(file) {
        try {
            if (!file) {
                throw new ErrorResponse('No file provided', 400);
            }

            const allowedMimes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'text/csv'
            ];
            if (!allowedMimes.includes(file.mimetype)) {
                throw new ErrorResponse('Invalid file format. Please upload Excel or CSV', 400);
            }

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(file.buffer);
            const worksheet = workbook.getWorksheet(1);
            if (!worksheet) {
                throw new ErrorResponse('No worksheet found in the Excel file', 400);
            }

            const columnMap = {};
            const headerRow = worksheet.getRow(1);
            headerRow.eachCell((cell, colNumber) => {
                columnMap[cell.value?.toString().toLowerCase()] = colNumber;
            });

            const students = [];
            const existingIds = new Set();

            const snapshot = await db.collection('student').get();
            snapshot.forEach(doc => {
                existingIds.add(doc.data().studentProfile.studentID);
            });

            worksheet.eachRow((row, rowNumber) => {
                if (rowNumber === 1) return;

                try {
                    const studentID = row.getCell(columnMap['studentid'] || 1).value?.toString();
                    if (!studentID) {
                        throw new Error('Missing studentID');
                    }
                    if (existingIds.has(studentID)) {
                        throw new Error(`Duplicate studentID: ${studentID}`);
                    }

                    const student = {
                        studentProfile: {
                            studentID,
                            name: row.getCell(columnMap['name'] || 2).value?.toString() || '',
                            dateOfBirth: row.getCell(columnMap['dateofbirth'] || 3).value?.toString() || '',
                            gender: row.getCell(columnMap['gender'] || 4).value?.toString() || '',
                            gradeLevel: row.getCell(columnMap['gradelevel'] || 5).value?.toString() || '',
                            school: row.getCell(columnMap['school'] || 6).value?.toString() || '',
                            class: row.getCell(columnMap['class'] || 7).value?.toString() || '',
                            educationSystem: row.getCell(columnMap['educationsystem'] || 8).value?.toString() || '',
                            fatherFullname: row.getCell(columnMap['fatherfullname'] || 9).value?.toString() || '',
                            fatherOccupation: row.getCell(columnMap['fatheroccupation'] || 10).value?.toString() || '',
                            motherFullname: row.getCell(columnMap['motherfullname'] || 11).value?.toString() || '',
                            motherOccupation: row.getCell(columnMap['motheroccupation'] || 12).value?.toString() || ''
                        },
                        studentDocument: {
                            image: row.getCell(columnMap['image'] || 13).value?.toString() || '',
                            birthCertificate: row.getCell(columnMap['birthcertificate'] || 14).value?.toString() || '',
                            householdRegistration: row.getCell(columnMap['householdregistration'] || 15).value?.toString() || ''
                        }
                    };

                    const { error } = validateStudent(student.studentProfile, 'create');
                    if (error) {
                        throw new Error(`Invalid data at row ${rowNumber}: ${error.details.map(e => e.message).join(', ')}`);
                    }

                    students.push(toFirebaseFormat(student));
                    existingIds.add(studentID);
                } catch (rowError) {
                    console.error(`Error processing row ${rowNumber}: ${rowError.message}`);
                }
            });

            if (students.length === 0) {
                throw new ErrorResponse('No valid student data found in the file', 400);
            }

            const batch = db.batch();
            students.forEach(student => {
                const docRef = db.collection('student').doc();
                batch.set(docRef, student);
            });

            await batch.commit();

            return {
                success: true,
                count: students.length
            };
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Failed to import students: ${error.message}`, 500);
        }
    }

    async exportStudents(format, students) {
        try {
            if (!Array.isArray(students) || students.length === 0) {
                throw new ErrorResponse('No students data provided', 400);
            }

            if (format === 'xlsx') {
                const workbook = new ExcelJS.Workbook();
                const worksheet = workbook.addWorksheet('Students');

                worksheet.columns = [
                    { header: 'Student ID', key: 'studentID', width: 15 },
                    { header: 'Full Name', key: 'name', width: 30 },
                    { header: 'Date of Birth', key: 'dateOfBirth', width: 15 },
                    { header: 'Gender', key: 'gender', width: 10 },
                    { header: 'Grade Level', key: 'gradeLevel', width: 15 },
                    { header: 'School', key: 'school', width: 30 },
                    { header: 'Class', key: 'class', width: 15 },
                    { header: 'Education System', key: 'educationSystem', width: 20 },
                    { header: 'Father\'s Name', key: 'fatherFullname', width: 30 },
                    { header: 'Father\'s Occupation', key: 'fatherOccupation', width: 30 },
                    { header: 'Mother\'s Name', key: 'motherFullname', width: 30 },
                    { header: 'Mother\'s Occupation', key: 'motherOccupation', width: 30 },
                    { header: 'Image', key: 'image', width: 30 },
                    { header: 'Birth Certificate', key: 'birthCertificate', width: 30 },
                    { header: 'Household Registration', key: 'householdRegistration', width: 30 }
                ];

                students.forEach(student => {
                    worksheet.addRow({
                        studentID: student.studentID || '',
                        name: student.name || '',
                        dateOfBirth: student.dateOfBirth || '',
                        gender: student.gender || '',
                        gradeLevel: student.gradeLevel || '',
                        school: student.school || '',
                        class: student.class || '',
                        educationSystem: student.educationSystem || '',
                        fatherFullname: student.fatherFullname || '',
                        fatherOccupation: student.fatherOccupation || '',
                        motherFullname: student.motherFullname || '',
                        motherOccupation: student.motherOccupation || '',
                        image: student.studentDocument?.image || '',
                        birthCertificate: student.studentDocument?.birthCertificate || '',
                        householdRegistration: student.studentDocument?.householdRegistration || ''
                    });
                });

                worksheet.getRow(1).font = { bold: true };
                worksheet.getRow(1).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFE0E0E0' }
                };

                const buffer = await workbook.xlsx.writeBuffer();
                return buffer;
            } else if (format === 'json') {
                return JSON.stringify(students, null, 2);
            } else {
                throw new ErrorResponse('Invalid export format', 400);
            }
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Failed to export students: ${error.message}`, 500);
        }
    }

    async getStudentsByClass(classId) {
        try {
            return await this.studentRepository.findByClass(classId);
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error retrieving students by class: ${error.message}`, 500);
        }
    }

    async searchStudents(searchTerm) {
        try {
            return await this.studentRepository.search(searchTerm);
        } catch (error) {
            throw error instanceof ErrorResponse ? error : new ErrorResponse(`Error searching students: ${error.message}`, 500);
        }
    }
}

module.exports = { StudentService };