const toClientFormat = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        className: data.className,
        teacherID: data.teacherID || null,
        students: data.students || [],
        semesterID: data.semesterID || null
    };
};

const toFirebaseFormat = (classData) => {
    // Only include essential fields
    return {
        className: classData.className.trim(),
        teacherID: classData.teacherID ? classData.teacherID.trim() : null,
        students: classData.students || [],
        semesterID: classData.semesterID || null
    };
};

const validateClass = (classData) => {
    const errors = [];

    if (!classData.className || typeof classData.className !== 'string' || classData.className.trim() === '') {
        errors.push('Class name is required');
    }

    // Validate teacherID if provided
    if (classData.teacherID !== undefined && classData.teacherID !== null) {
        if (typeof classData.teacherID !== 'string' || classData.teacherID.trim() === '') {
            errors.push('Teacher ID must be a non-empty string if provided');
        }
    }

    return {
        isValid: errors.length === 0,
        errors: errors.join(', ')
    };
};

module.exports = {
    validateClass,
    toFirebaseFormat,
    toClientFormat
}; 