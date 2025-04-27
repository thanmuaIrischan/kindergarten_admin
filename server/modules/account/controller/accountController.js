const accountService = require('../service/accountService');
const twilio = require('twilio');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const authenticate = async (req, res) => {
  try {
    console.log('Received login request with body:', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    console.log('Attempting to authenticate user:', username);
    const result = await accountService.authenticate(username, password);
    console.log('Authentication result:', result);

    if (!result.success) {
      return res.status(401).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error('Authentication error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Authentication failed',
      error: error.message 
    });
  }
};

const getAccountById = async (req, res) => {
  try {
    const result = await accountService.getAccountById(req.params.id);
    if (!result.success) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    console.error('Error getting account:', error);
    res.status(500).json({ success: false, message: 'Failed to get account' });
  }
};

const sendVerificationCode = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: 'Phone number is required'
            });
        }

        // Generate a 6-digit verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store the verification code in the database with an expiration time
        await accountService.storeVerificationCode(phoneNumber, verificationCode);

        // Send the verification code via SMS using Twilio
        await twilioClient.messages.create({
            body: `Your verification code is: ${verificationCode}. This code will expire in 10 minutes.`,
            to: phoneNumber,
            from: process.env.TWILIO_PHONE_NUMBER
        });

        res.json({
            success: true,
            message: 'Verification code sent successfully'
        });
    } catch (error) {
        console.error('Error sending verification code:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send verification code',
            error: error.message
        });
    }
};

const verifyCode = async (req, res) => {
    try {
        const { phoneNumber, code } = req.body;
        
        if (!phoneNumber || !code) {
            return res.status(400).json({
                success: false,
                message: 'Phone number and verification code are required'
            });
        }

        const isValid = await accountService.verifyCode(phoneNumber, code);
        
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification code'
            });
        }

        res.json({
            success: true,
            message: 'Code verified successfully'
        });
    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to verify code',
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { phoneNumber, code, newPassword } = req.body;
        
        if (!phoneNumber || !code || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Phone number, verification code, and new password are required'
            });
        }

        const result = await accountService.resetPassword(phoneNumber, code, newPassword);
        
        if (!result.success) {
            return res.status(400).json(result);
        }

        res.json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reset password',
            error: error.message
        });
    }
};

module.exports = {
  authenticate,
  getAccountById,
  sendVerificationCode,
  verifyCode,
  resetPassword
}; 