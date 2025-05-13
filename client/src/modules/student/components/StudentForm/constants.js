export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Helper function to format field name for error messages
export const formatFieldName = (name) => {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase())
        .replace(/([a-z])([A-Z])/g, '$1 $2');
};

// Validation helper functions
export const validationHelpers = {
    isEmptyOrWhitespace: (str) => {
        return !str || str.trim().length === 0;
    },
    
    isOnlySpaces: (str) => {
        return str && str.trim().length === 0;
    },
    
    isValidInput: (str) => {
        return str && str.trim().length > 0;
    }
}; 