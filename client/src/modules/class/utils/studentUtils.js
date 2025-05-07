import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchStudents = async (classId) => {
    if (!classId) {
        console.error('Cannot fetch students - missing class ID');
        return [];
    }

    try {
        // Get fresh class data to get the latest student IDs
        const classResponse = await axios.get(`${API_URL}/class/${classId}`);
        const freshClassData = classResponse.data.data;
        const studentIDs = freshClassData.students || [];

        console.log('Fresh class data:', freshClassData);
        console.log('Student IDs:', studentIDs);

        if (!studentIDs || studentIDs.length === 0) {
            console.log('No students found in class');
            return [];
        }

        // Fetch each student's details from the student table
        const studentPromises = studentIDs.map(async (studentId) => {
            try {
                const response = await axios.get(`${API_URL}/student/${studentId}`);
                const studentData = response.data.data;
                console.log('Fetched student data:', studentData);
                return {
                    id: studentData.id,
                    studentID: studentData.studentID,
                    firstName: studentData.firstName,
                    lastName: studentData.lastName,
                    gender: studentData.gender,
                    dateOfBirth: studentData.dateOfBirth,
                    phone: studentData.phone,
                    email: studentData.email,
                    address: studentData.address,
                    avatar: studentData.avatar
                };
            } catch (error) {
                console.error(`Failed to fetch student ${studentId}:`, error);
                return null;
            }
        });

        const studentResponses = await Promise.all(studentPromises);
        return studentResponses.filter(Boolean);
    } catch (error) {
        console.error('Error in fetchStudents:', error);
        return [];
    }
};

export const addStudentToClass = async (student, classId, onSuccess) => {
    try {
        console.log('Student added:', student);
        await onSuccess();
    } catch (error) {
        console.error('Error in addStudentToClass:', error);
    }
};

export const removeStudentFromClass = async (student, classId, onSuccess) => {
    try {
        console.log('Student removed:', student);
        await onSuccess();
    } catch (error) {
        console.error('Error in removeStudentFromClass:', error);
    }
};

export const transferStudentsToClass = async (students, targetClass, classId, onSuccess) => {
    try {
        console.log('Students transferred:', { students, targetClass });
        await onSuccess();
    } catch (error) {
        console.error('Error in transferStudentsToClass:', error);
    }
}; 