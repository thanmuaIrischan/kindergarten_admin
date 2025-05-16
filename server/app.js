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
const userAccountRoutes = require('./modules/user_account/userAccountRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
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
app.use("/api/user-accounts", userAccountRoutes);

// 404 handler
app.use((req, res, next) => {
    console.log(`404 Not Found: ${req.method} ${req.url}`);
    res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    // Ensure we have a valid status code
    const statusCode = err.statusCode || 500;
    
    // Ensure we have a valid status string
    const status = err.status || (statusCode >= 400 && statusCode < 500 ? 'fail' : 'error');
    
    res.status(statusCode).json({
        success: false,
        status,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app; 