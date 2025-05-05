const toClientFormat = (doc) => {
    const data = doc.data();
    return {
        id: doc.id,
        className: data.className,
        teacherID: data.teacherID || null,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
    };
};

const toFirebaseFormat = (classData) => {
    return {
        className: classData.className.trim(),
        teacherID: classData.teacherID ? classData.teacherID.trim() : null,
        createdAt: classData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
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