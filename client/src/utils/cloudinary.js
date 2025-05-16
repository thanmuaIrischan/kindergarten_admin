const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';

export const getCloudinaryUrl = (publicId, options = {}) => {
  if (!publicId) return '';
  
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // If publicId is already a full URL, extract just the ID part
  if (publicId.includes('cloudinary.com')) {
    const parts = publicId.split('/upload/');
    if (parts.length === 2) {
      publicId = parts[1].split('.')[0];
    }
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/c_${crop},w_${width},h_${height},q_${quality},f_${format}/v1/${publicId}`;
};

export const optimizeCloudinaryImage = (url, options = {}) => {
  if (!url) return '';
  
  // If it's not a Cloudinary URL, return as is
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  try {
    // Extract the version and public ID from the URL
    const matches = url.match(/\/v\d+\/(.+)$/) || url.match(/\/upload\/(.+)$/);
    if (!matches || !matches[1]) {
      return url;
    }

    const publicId = matches[1].split('.')[0]; // Remove file extension if present
    return getCloudinaryUrl(publicId, options);
  } catch (error) {
    console.error('Error optimizing Cloudinary URL:', error);
    return url;
  }
}; 