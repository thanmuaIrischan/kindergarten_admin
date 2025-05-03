// E:\MyProject\PROJECT\kindergarten_admin\server\index.js
require("dotenv").config();
require('./config/firebase'); // Initialize Firebase
const app = require('./app');

const port = process.env.PORT || 3001;

// Configure Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
