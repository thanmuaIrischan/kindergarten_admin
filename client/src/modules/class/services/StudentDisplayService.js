/**
 * Service to handle student display logic
 */

/**
 * Get display name for student
 * @param {Object} student - The student object
 * @returns {string} The formatted display name
 */
export const getStudentDisplayName = (student) => {
    if (!student) return '';
    
    // Handle nested studentProfile structure
    if (student.studentProfile) {
        return student.studentProfile.name || '';
    }
    
    // Handle combined first and last name
    if (student.firstName && student.lastName) {
        return `${student.firstName} ${student.lastName}`;
    }
    
    // If student has direct name property
    if (student.name) {
        return student.name;
    }

    // Fallback to empty string if no name is available
    return '';
};

/**
 * Get first letter of student name for avatar
 * @param {Object} student - The student object
 * @returns {string} The first letter of student name
 */
export const getStudentNameInitial = (student) => {
    const displayName = getStudentDisplayName(student);
    return displayName ? displayName[0].toUpperCase() : '?';
};

/**
 * Format student data for display
 * @param {Object} student - The student object
 * @returns {Object} Formatted student data
 */
export const formatStudentForDisplay = (student) => {
    if (!student) return null;

    const profile = student.studentProfile || student;
    
    return {
        ...student,
        displayName: getStudentDisplayName(student),
        nameInitial: getStudentNameInitial(student),
        // Extract other display fields from profile
        studentID: profile.studentID || student.studentID || '',
        name: getStudentDisplayName(student),
        gender: profile.gender || student.gender || '',
        dateOfBirth: profile.dateOfBirth || student.dateOfBirth || '',
        class: profile.class || student.class || '',
        phone: profile.phone || student.phone || '',
        email: profile.email || student.email || '',
        address: profile.address || student.address || ''
    };
}; 