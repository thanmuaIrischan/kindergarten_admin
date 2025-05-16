const cloudinary = require('cloudinary').v2;

class ImageService {
    /**
     * Process student document fields to optimize Cloudinary URLs
     * @param {Object} student - Student data with studentDocument
     * @returns {Object} Student data with optimized URLs
     */
    processStudentImages(student) {
        if (!student || !student.studentDocument) {
            console.warn('Invalid student data or missing studentDocument');
            return student;
        }

        const documentFields = ['image', 'birthCertificate', 'householdRegistration'];
        const updatedDocument = { ...student.studentDocument };

        documentFields.forEach(field => {
            if (updatedDocument[field]) {
                try {
                    updatedDocument[field] = this.optimizeImageUrl(
                        updatedDocument[field],
                        field === 'image' ? { width: 500, height: 500, crop: 'fill', gravity: 'face' } : {}
                    );
                } catch (error) {
                    console.error(`Error optimizing ${field} for student ${student.studentID}:`, error.message);
                    updatedDocument[field] = ''; // Đặt rỗng nếu lỗi
                }
            }
        });

        return {
            ...student,
            studentDocument: updatedDocument
        };
    }

    /**
     * Convert public_id to optimized Cloudinary URL
     * @param {string} publicId - Cloudinary public_id
     * @param {Object} [options] - Additional transformation options
     * @returns {string} Optimized Cloudinary URL
     */
    optimizeImageUrl(publicId, options = {}) {
        if (!publicId || typeof publicId !== 'string') {
            throw new Error('Invalid public_id');
        }

        // Nếu đã là URL Cloudinary, lấy public_id
        let id = publicId;
        if (publicId.includes('cloudinary.com')) {
            const parts = publicId.split('/upload/');
            if (parts.length === 2) {
                id = parts[1].split('/').slice(1).join('/');
            }
        }

        // Xây dựng URL với các tham số tối ưu hóa
        const defaultOptions = {
            fetch_format: 'auto',
            quality: 'auto',
            secure: true,
            ...options
        };

        try {
            return cloudinary.url(id, defaultOptions);
        } catch (error) {
            throw new Error(`Failed to generate Cloudinary URL: ${error.message}`);
        }
    }
}

module.exports = new ImageService();