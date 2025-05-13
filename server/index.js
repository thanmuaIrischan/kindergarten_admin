// E:\MyProject\PROJECT\kindergarten_admin\server\index.js
require("dotenv").config();
require('./config/firebase'); // Initialize Firebase
const app = require('./app');

const port = process.env.PORT || 3001;

// Debug: Check if environment variables are loaded
const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
};

console.log('Cloudinary Config:', {
    cloud_name: cloudinaryConfig.cloud_name ? 'Set' : 'Not Set',
    api_key: cloudinaryConfig.api_key ? 'Set' : 'Not Set',
    api_secret: cloudinaryConfig.api_secret ? 'Set' : 'Not Set'
});

// Check if all required Cloudinary credentials are present
if (!cloudinaryConfig.cloud_name || !cloudinaryConfig.api_key || !cloudinaryConfig.api_secret) {
    console.error('Error: Missing Cloudinary credentials. Please check your .env file.');
    console.error('Required environment variables:');
    console.error('CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.error('CLOUDINARY_API_KEY=your_api_key');
    console.error('CLOUDINARY_API_SECRET=your_api_secret');
    process.exit(1);
}

// Configure Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config(cloudinaryConfig);

// Test Cloudinary configuration
cloudinary.api.ping()
    .then(() => console.log('Cloudinary connection successful'))
    .catch(error => {
        console.error('Cloudinary connection error:', error);
        process.exit(1);
    });

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
