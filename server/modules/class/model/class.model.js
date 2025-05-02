const toClientFormat = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        className: data.className,
        teacherID: data.teacherID,
        students: data.students || [],
        studentsCount: data.students ? data.students.length : 0,
        semesterID: data.semesterID || null
    };
};

const toFirebaseFormat = (classData) => {
    return {
        className: classData.className,
        teacherID: classData.teacherID,
        students: classData.students || [],
        semesterID: classData.semesterID || null
    };
};

const validateClass = (data) => {
    const errors = {};

    if (!data.className) {
        errors.className = 'Class name is required';
    }

    if (!data.teacherID) {
        errors.teacherID = 'Teacher ID is required';
    }

    if (!data.semesterID) {
        errors.semesterID = 'Semester ID is required';
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};

module.exports = {
    toClientFormat,
    toFirebaseFormat,
    validateClass
}; 