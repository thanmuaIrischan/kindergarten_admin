// E:\MyProject\PROJECT\kindergarten_admin\server\index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const accountRoutes = require("./modules/account/routes/accountRoutes");
const newsRoutes = require("./modules/news/routes/newsRoutes");
const twilioRoutes = require("./modules/twilio/routes/twilioRoutes");
const studentRoutes = require("./modules/student/routes/student.routes");
const semesterRoutes = require("./modules/semester/routes/semester.routes");
require('./config/firebase'); // Initialize Firebase

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log('Request body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

// Configure Cloudinary
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
app.use("/api/account", accountRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/semester", semesterRoutes);

// 404 handler - must be before error handler
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        status: err.statusCode || err.status,
        path: `${req.method} ${req.url}`,
        body: req.body
    });

    // Handle specific error types
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: err.errors || err.message
        });
    }

    // Handle Firebase errors
    if (err.code && err.code.startsWith('auth/')) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }

    // Handle custom ErrorResponse
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    // Default error
    res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { error: err.message, stack: err.stack })
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
