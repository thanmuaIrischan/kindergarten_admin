// E:\MyProject\PROJECT\kindergarten_admin\server\index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const accountRoutes = require("./modules/account/routes/accountRoutes");
const newsRoutes = require("./modules/news/routes/newsRoutes");
const twilioRoutes = require("./modules/twilio/routes/twilioRoutes");
require('./config/firebase'); // Initialize Firebase

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Routes
app.use("/api/account", accountRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/twilio", twilioRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
    });
    res.status(500).json({ 
        success: false, 
        message: 'Something broke!' + err.message,
        error: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
