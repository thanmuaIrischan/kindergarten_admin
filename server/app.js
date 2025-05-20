const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Import all routes
const accountRoutes = require("./modules/account/routes/accountRoutes");
const newsRoutes = require("./modules/news");
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
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    });
});

module.exports = app; 