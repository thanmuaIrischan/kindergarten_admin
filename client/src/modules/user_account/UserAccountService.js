import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const API_PATH = `${API_URL}/user-accounts`;

const getUserAccounts = async () => {
  try {
    console.log('Fetching user accounts from:', API_PATH);
    const response = await axios.get(API_PATH);
    console.log('Received accounts:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching accounts:', error.response?.data || error.message);
    throw error;
  }
};

const getUserAccountById = async (id) => {
  try {
    console.log('Fetching user account by ID:', id);
  const response = await axios.get(`${API_PATH}/${id}`);
    console.log('Received account:', response.data);
  return response.data;
  } catch (error) {
    console.error('Error fetching account:', error.response?.data || error.message);
    throw error;
  }
};

const createUserAccount = async (accountData) => {
  try {
    console.log('Creating user account with data:', accountData);
    const response = await axios.post(API_PATH, accountData);
    console.log('Created account:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating account:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to create account. Please try again.');
  }
};

const updateUserAccount = async (id, accountData) => {
  try {
    console.log('Updating user account:', id, 'with data:', accountData);
    const response = await axios.put(`${API_PATH}/${id}`, accountData);
    console.log('Updated account:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating account:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to update account. Please try again.');
  }
};

const deleteUserAccount = async (id) => {
  try {
    console.log('Deleting user account:', id);
    const response = await axios.delete(`${API_PATH}/${id}`);
    console.log('Delete response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error deleting account:', error.response?.data || error.message);
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to delete account. Please try again.');
  }
}; 

const UserAccountService = {
  getUserAccounts,
  getUserAccountById,
  createUserAccount,
  updateUserAccount,
  deleteUserAccount
};

export {
  getUserAccounts,
  getUserAccountById,
  createUserAccount,
  updateUserAccount,
  deleteUserAccount
};

export default UserAccountService; 