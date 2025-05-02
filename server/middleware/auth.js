const ErrorResponse = require('../utils/errorResponse');
const admin = require('firebase-admin');

exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // Verify token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // Add user info to request
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            role: decodedToken.role || 'user'
        };

        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
}; 