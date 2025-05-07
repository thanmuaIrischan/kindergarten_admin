import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchTeacherDetails = async (teacherId) => {
    try {
        if (!teacherId) {
            console.log('No teacherID provided');
            return null;
        }

        const teacherIdTrimmed = teacherId.trim();
        console.log('Fetching teacher details for ID:', teacherIdTrimmed);

        const response = await axios.get(`${API_URL}/teacher/by-teacher-id/${teacherIdTrimmed}`);
        console.log('Full API Response:', response);

        if (response.data) {
            console.log('Response data:', response.data);
            const teacher = response.data;
            return {
                firstName: teacher.firstName || '',
                lastName: teacher.lastName || '',
                teacherID: teacher.teacherID || '',
                gender: teacher.gender || '',
                phone: teacher.phone || '',
                dateOfBirth: teacher.dateOfBirth || '',
                avatar: teacher.avatar || ''
            };
        } else {
            console.error('Invalid response format:', response);
            return null;
        }
    } catch (error) {
        console.error('Error fetching teacher details:', {
            message: error.response?.data?.message || error.message,
            status: error.response?.status,
            teacherID: teacherId,
            error: error
        });
        return null;
    }
};

export const updateTeacher = async (newTeacher, updatedClass, classData, onSuccess) => {
    if (!newTeacher) return;

    try {
        console.log('Handling teacher change:', { newTeacher, updatedClass });

        // Update class data while preserving existing data
        if (updatedClass && classData) {
            Object.assign(classData, {
                ...classData,
                ...updatedClass,
                students: updatedClass.students || classData.students || [],
                semesterID: updatedClass.semesterID || classData.semesterID
            });
            console.log('Updated class data:', classData);
        }

        await onSuccess();
    } catch (error) {
        console.error('Error in handleTeacherChange:', error);
    }
}; 