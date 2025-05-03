import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const getAllTeachers = async () => {
    try {
        const response = await axios.get(`${API_URL}/teacher`);
        return response;
    } catch (error) {
        throw error;
    }
};

export const getTeacherById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/teacher/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createTeacher = async (teacherData) => {
    try {
        const response = await axios.post(`${API_URL}/teacher`, teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateTeacher = async (id, teacherData) => {
    try {
        const response = await axios.put(`${API_URL}/teacher/${id}`, teacherData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteTeacher = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/teacher/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const searchTeachers = async (query) => {
    try {
        const response = await axios.get(`${API_URL}/teacher/search?query=${query}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}; 