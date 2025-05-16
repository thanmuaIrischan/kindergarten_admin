// Convert date from dd-mm-yyyy to yyyy-mm-dd for HTML input
export const convertToHTMLDateFormat = (dateString) => {
    if (!dateString) return '';
    
    // Check if the date is already in HTML format
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return dateString;
    }

    // Parse dd-mm-yyyy format
    const [day, month, year] = dateString.split('-');
    if (!day || !month || !year) return '';

    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

// Convert date from yyyy-mm-dd (HTML format) to dd-mm-yyyy for API
export const convertToAPIDateFormat = (dateString) => {
    if (!dateString) return '';

    // If it's already in dd-mm-yyyy format, return as is
    if (dateString.match(/^\d{2}-\d{2}-\d{4}$/)) {
        return dateString;
    }

    // Parse yyyy-mm-dd format
    const [year, month, day] = dateString.split('-');
    if (!day || !month || !year) return '';

    return `${day.padStart(2, '0')}-${month.padStart(2, '0')}-${year}`;
}; 