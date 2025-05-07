import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchSemesterDetails = async (semesterId) => {
    if (!semesterId) {
        console.log('No semesterID provided');
        return null;
    }

    try {
        console.log('Fetching semester details for ID:', semesterId);
        const response = await axios.get(`${API_URL}/semester/${semesterId}`);

        if (response.data && response.data.data) {
            console.log('Fetched semester details:', response.data.data);
            return response.data.data;
        } else {
            console.error('Invalid semester response:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching semester details:', error);
        return null;
    }
};

export const updateSemester = async (newSemester, updatedClass, classData, onSuccess) => {
    try {
        if (!newSemester || !updatedClass) {
            console.error('Invalid semester change data:', { newSemester, updatedClass });
            return;
        }

        // Update the class data with the new information
        Object.assign(classData, updatedClass);
        await onSuccess();
    } catch (error) {
        console.error('Error in updateSemester:', error);
    }
}; 