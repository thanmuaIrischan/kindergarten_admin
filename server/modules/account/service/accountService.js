const accountRepository = require('../repository/accountRepository');
const { db } = require('../../../config/firebase');
const bcrypt = require('bcrypt');

const authenticate = async (username, password) => {
  try {
    console.log('Authentication attempt for username:', username);

    if (!username || !password) {
      console.log('Missing username or password');
      return { success: false, message: 'Invalid credentials' };
    }

    const account = await accountRepository.findByUsername(username);
    console.log('Account found:', account ? 'Yes' : 'No');

    if (!account) {
      console.log('No account found for username:', username);
      return { success: false, message: 'Invalid credentials' };
    }

    // Add debug logging for account data
    console.log('Account data:', {
      ...account,
      password: '***' // Mask password in logs
    });

    // Test password match
    const storedPassword = account.password;
    const isPasswordValid = password === storedPassword;

    console.log('Password verification:');
    console.log('Password match:', isPasswordValid);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid credentials' };
    }

    // Ensure we're returning all required fields
    const userData = {
      id: account.id,
      username: account.username,
      role: account.role,
      fullName: account.fullName,
      phoneNumber: account.phoneNumber,
      actor: account.actor
    };

    console.log('Authentication successful. Returning user data:', userData);

    return {
      success: true,
      data: userData
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return { success: false, message: 'Authentication failed' };
  }
};

const getAccountById = async (id) => {
  try {
    const account = await accountRepository.findById(id);
    if (!account) {
      return { success: false, message: 'Account not found' };
    }
    return {
      success: true,
      data: {
        id: account.id,
        username: account.username,
        role: account.role,
        fullName: account.fullName,
        phoneNumber: account.phoneNumber,
        actor: account.actor
      }
    };
  } catch (error) {
    console.error('Error getting account:', error);
    return { success: false, message: 'Failed to get account' };
  }
};

const storeVerificationCode = async (phoneNumber, code) => {
  try {
    const verificationRef = db.collection('verificationCodes').doc(phoneNumber);
    await verificationRef.set({
      code: await bcrypt.hash(code, 10),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    });
    return true;
  } catch (error) {
    console.error('Error storing verification code:', error);
    throw error;
  }
};

const verifyCode = async (phoneNumber, code) => {
  try {
    const verificationRef = db.collection('verificationCodes').doc(phoneNumber);
    const doc = await verificationRef.get();

    if (!doc.exists) {
      return false;
    }

    const data = doc.data();
    const now = new Date();

    if (now > data.expiresAt) {
      // Delete expired code
      await verificationRef.delete();
      return false;
    }

    const isCodeValid = await bcrypt.compare(code, data.code);
    if (!isCodeValid) {
      return false;
    }

    // Delete the code after successful verification
    await verificationRef.delete();
    return true;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

const resetPassword = async (phoneNumber, code, newPassword) => {
  try {
    // First verify the code
    const isValid = await verifyCode(phoneNumber, code);
    if (!isValid) {
      return { success: false, message: 'Invalid or expired verification code' };
    }

    // Find account by phone number
    const accountsRef = db.collection('account');
    const snapshot = await accountsRef.where('phoneNumber', '==', phoneNumber).get();

    if (snapshot.empty) {
      return { success: false, message: 'Account not found' };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    const accountRef = snapshot.docs[0].ref;
    await accountRef.update({ password: hashedPassword });

    return { success: true, message: 'Password reset successfully' };
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

module.exports = {
  authenticate,
  getAccountById,
  storeVerificationCode,
  verifyCode,
  resetPassword
}; 