const cloudinary = require('cloudinary').v2;

class ImageService {
    processStudentImages(student) {
        if (!student) return student;

        // Process student photo if exists
        if (student.studentDocument && student.studentDocument.image) {
            student.studentDocument.image = this.optimizeImageUrl(student.studentDocument.image);
        }

        // Process other documents if they exist
        if (student.studentDocument) {
            if (student.studentDocument.birthCertificate) {
                student.studentDocument.birthCertificate = this.optimizeImageUrl(student.studentDocument.birthCertificate);
            }
            if (student.studentDocument.householdRegistration) {
                student.studentDocument.householdRegistration = this.optimizeImageUrl(student.studentDocument.householdRegistration);
            }
        }

        return student;
    }

    optimizeImageUrl(url) {
        if (!url || typeof url !== 'string') return url;

        // If it's already a Cloudinary URL, add optimization parameters
        if (url.includes('cloudinary.com')) {
            // Add auto-format and auto-quality parameters
            const transformations = 'f_auto,q_auto';

            // Insert transformation parameters before the upload path
            const parts = url.split('/upload/');
            if (parts.length === 2) {
                return `${parts[0]}/upload/${transformations}/${parts[1]}`;
            }
        }

        return url;
    }
}

module.exports = new ImageService(); 