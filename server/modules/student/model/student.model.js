const imageService = require('../service/image.service');

const studentModel = {
    studentProfile: {
        studentID: '',
        name: '',
        dateOfBirth: '',
        gender: '',
        fatherFullname: '',
        fatherOccupation: '',
        motherFullname: '',
        motherOccupation: '',
        gradeLevel: 0,
        school: '',
        class: '',
        educationSystem: ''
    },
    studentDocument: {
        image: '',
        birthCertificate: '',
        householdRegistration: ''
    }
};

const toFirebaseFormat = (data) => {
    // Check if data has nested structure
    const profile = data.studentProfile || data;
    
    if (!profile.studentID) {
        throw new Error('studentID is required');
    }
    if (!profile.name) {
        throw new Error('name is required');
    }
    if (!profile.class) {
        throw new Error('class is required');
    }

    return {
        studentProfile: {
            studentID: profile.studentID,
            name: profile.name,
            dateOfBirth: profile.dateOfBirth || '',
            gender: profile.gender || '',
            fatherFullname: profile.fatherFullname || '',
            fatherOccupation: profile.fatherOccupation || '',
            motherFullname: profile.motherFullname || '',
            motherOccupation: profile.motherOccupation || '',
            gradeLevel: parseInt(profile.gradeLevel) || 0,
            school: profile.school || '',
            class: profile.class || '',
            educationSystem: profile.educationSystem || ''
        },
        studentDocument: data.studentDocument || {
            image: '',
            birthCertificate: '',
            householdRegistration: ''
        }
    };
};

const toClientFormat = (doc) => {
    const data = doc.data();
    const profile = data.studentProfile || {};
    
    const student = {
        id: doc.id,
        studentID: profile.studentID || '',
        name: profile.name || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        fatherFullname: profile.fatherFullname || '',
        fatherOccupation: profile.fatherOccupation || '',
        motherFullname: profile.motherFullname || '',
        motherOccupation: profile.motherOccupation || '',
        gradeLevel: profile.gradeLevel || 0,
        school: profile.school || '',
        class: profile.class || '',
        educationSystem: profile.educationSystem || '',
        studentDocument: data.studentDocument || {
            image: '',
            birthCertificate: '',
            householdRegistration: ''
        }
    };

    return imageService.processStudentImages(student);
};

module.exports = {
    studentModel,
    toFirebaseFormat,
    toClientFormat
};