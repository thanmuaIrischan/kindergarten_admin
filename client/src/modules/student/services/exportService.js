import axiosInstance from '../../../utils/axios';

export const exportStudentsToExcel = async () => {
    try {
        // Call the server's export endpoint
        const response = await axiosInstance.get('/student/export/excel', {
            responseType: 'blob' // Important: This tells axios to expect binary data
        });

        // Check if the response is an error message
        if (response.data.type === 'application/json') {
            const reader = new FileReader();
            const errorData = await new Promise((resolve) => {
                reader.onload = () => resolve(JSON.parse(reader.result));
                reader.readAsText(response.data);
            });
            throw new Error(errorData.message || 'Failed to export students');
        }

        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = `students_export_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error exporting students:', error);
        throw error;
    }
}; 