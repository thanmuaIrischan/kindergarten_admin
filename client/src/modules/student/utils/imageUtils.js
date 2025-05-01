const CLOUDINARY_CLOUD_NAME = 'dv0ehr5z7';

const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

const getCloudinaryUrl = (publicId, options = {}) => {
    if (!publicId) return '';

    // If it's already a full URL, return as is
    if (isValidUrl(publicId)) {
        return publicId;
    }

    const {
        width,
        height,
        crop = 'fill',
        quality = 'auto',
        format = 'auto'
    } = options;

    let transformations = ['c_' + crop];

    if (width) transformations.push('w_' + width);
    if (height) transformations.push('h_' + height);

    transformations.push('q_' + quality);
    transformations.push('f_' + format);

    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations.join(',')}/${publicId}`;
};

const getProcessedImages = (imageId) => {
    if (!imageId) return null;

    return {
        thumbnail: getCloudinaryUrl(imageId, { width: 200, height: 200, crop: 'fill' }),
        medium: getCloudinaryUrl(imageId, { width: 600, height: 600, crop: 'fill' }),
        large: getCloudinaryUrl(imageId, { width: 1200, height: 1200, crop: 'fit' }),
        original: getCloudinaryUrl(imageId, { quality: 100 })
    };
};

const processStudentImages = (student) => {
    if (!student?.studentDocument) return student;

    const processedImages = {
        studentPhoto: getProcessedImages(student.studentDocument.image),
        transcriptPhoto: getProcessedImages(student.studentDocument.birthCertificate),
        householdRegistration: getProcessedImages(student.studentDocument.householdRegistration)
    };

    return {
        ...student,
        processedImages
    };
};

export {
    getCloudinaryUrl,
    getProcessedImages,
    processStudentImages
}; 