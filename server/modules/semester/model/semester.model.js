const toClientFormat = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        semesterName: data.semesterName || '',
        startDate: data.startDate || '',
        endDate: data.endDate || ''
    };
};

const toFirebaseFormat = (semesterData) => {
    return {
        semesterName: semesterData.semesterName,
        startDate: semesterData.startDate,
        endDate: semesterData.endDate
    };
};

const validateSemester = (data) => {
    const errors = {};

    if (!data.semesterName) {
        errors.semesterName = 'Semester name is required';
    }

    if (!data.startDate) {
        errors.startDate = 'Start date is required';
    }

    if (!data.endDate) {
        errors.endDate = 'End date is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    toClientFormat,
    toFirebaseFormat,
    validateSemester
}; 