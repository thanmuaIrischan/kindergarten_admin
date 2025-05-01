// Firebase Student Data Model Structure
const studentModel = {
    studentProfile: {
        firstName: '',
        lastName: '',
        dateOfBirth: '', // ISO string
        gender: '', // 'male', 'female', 'other'
        parentName: '',
        parentContact: '',
        parentEmail: '',
        address: '',
        enrollmentDate: '', // ISO string
        class: '',
        medicalConditions: [], // array of strings
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        }
    },
    studentDocument: {
        studentPhoto: {
            url: '',
            public_id: ''
        },
        transcriptPhoto: {
            url: '',
            public_id: ''
        },
        householdRegistration: {
            url: '',
            public_id: ''
        }
    },
    createdAt: '', // ISO string
    updatedAt: '' // ISO string
};

// Helper function to convert client data to Firebase format
const toFirebaseFormat = (data) => {
    return {
        studentProfile: {
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            dateOfBirth: data.dateOfBirth || new Date().toISOString(),
            gender: data.gender || '',
            parentName: data.parentName || '',
            parentContact: data.parentContact || '',
            parentEmail: data.parentEmail || '',
            address: data.address || '',
            enrollmentDate: data.enrollmentDate || new Date().toISOString(),
            class: data.class || '',
            medicalConditions: Array.isArray(data.medicalConditions) ? data.medicalConditions : [],
            emergencyContact: {
                name: data.emergencyContact?.name || '',
                relationship: data.emergencyContact?.relationship || '',
                phone: data.emergencyContact?.phone || ''
            }
        },
        studentDocument: {
            studentPhoto: data.studentPhoto || { url: '', public_id: '' },
            transcriptPhoto: data.transcriptPhoto || { url: '', public_id: '' },
            householdRegistration: data.householdRegistration || { url: '', public_id: '' }
        },
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
};

// Helper function to convert Firebase data to client format
const toClientFormat = (doc) => {
    const data = doc.data();
    const profile = data.studentProfile || {};
    const documents = data.studentDocument || {};

    return {
        id: doc.id,
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        dateOfBirth: profile.dateOfBirth || '',
        gender: profile.gender || '',
        parentName: profile.parentName || '',
        parentContact: profile.parentContact || '',
        parentEmail: profile.parentEmail || '',
        address: profile.address || '',
        enrollmentDate: profile.enrollmentDate || '',
        class: profile.class || '',
        medicalConditions: profile.medicalConditions || [],
        emergencyContact: profile.emergencyContact || {},
        studentPhoto: documents.studentPhoto || null,
        transcriptPhoto: documents.transcriptPhoto || null,
        householdRegistration: documents.householdRegistration || null,
        createdAt: data.createdAt || '',
        updatedAt: data.updatedAt || ''
    };
};

module.exports = {
    studentModel,
    toFirebaseFormat,
    toClientFormat
}; 