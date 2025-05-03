const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import all routes
const accountRoutes = require("./modules/account/routes/accountRoutes");
const newsRoutes = require("./modules/news/routes/newsRoutes");
const twilioRoutes = require("./modules/twilio/routes/twilioRoutes");
const studentRoutes = require("./modules/student/routes/student.routes");
const semesterRoutes = require("./modules/semester/routes/semester.routes");
const classRoutes = require("./modules/class/routes/class.routes");
const teacherRoutes = require('./modules/teacher/routes/teacher.routes');

const app = express();

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

// Routes
app.use("/api/account", accountRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/twilio", twilioRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/semester", semesterRoutes);
app.use("/api/class", classRoutes);
app.use("/api/teacher", teacherRoutes);

// 404 handler
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

module.exports = app; 