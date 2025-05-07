import axios from 'axios';
import { API_BASE_URL } from '../../../config';

const CLASS_API = `${API_BASE_URL}/class`;

export const getAllClasses = async () => {
    try {
        const response = await axios.get(CLASS_API);
        console.log('Raw API Response:', {
            response,
            data: response.data,
            classes: response.data.data,
            structure: JSON.stringify(response.data)
        });

        // Ensure we're returning the correct structure
        if (response.data && !response.data.data) {
            // If the data is not wrapped in a data property, wrap it
            return { data: { data: response.data } };
        }
        return response;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

export const getClassById = async (id) => {
    try {
        const response = await axios.get(`${CLASS_API}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createClass = async (classData) => {
    try {
        const response = await axios.post(CLASS_API, classData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateClass = async (id, classData) => {
    try {
        const response = await axios.put(`${CLASS_API}/${id}`, classData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteClass = async (id) => {
    try {
        const response = await axios.delete(`${CLASS_API}/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const importClasses = async (classes) => {
    try {
        const response = await axios.post(`${CLASS_API}/import`, { classes });
        return response.data;
    } catch (error) {
        throw error;
    }
}; 