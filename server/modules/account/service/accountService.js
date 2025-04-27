const accountRepository = require('../repository/accountRepository');
const { db } = require('../../../config/firebase');

const authenticate = async (username, password) => {
  try {
    console.log('Service: Starting authentication for user:', username);
    console.log('Service: Input password:', password);
    
    const account = await accountRepository.findByUsername(username);
    
    if (!account) {
      console.log('Service: Account not found');
      return { success: false, message: 'User not found' };
    }

    console.log('Service: Found account data:', {
      id: account.id,
      username: account.username,
      storedPassword: account.password,
      role: account.role
    });

    console.log('Service: Comparing passwords - Input:', password, 'Stored:', account.password);
    if (account.password !== password) {
      console.log('Service: Password mismatch');
      return { success: false, message: 'Invalid password' };
    }

    console.log('Service: Authentication successful');
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
    console.error('Service: Authentication error:', error);
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
      code,
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

    if (data.code !== code) {
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

    // Update password
    const accountRef = snapshot.docs[0].ref;
    await accountRef.update({ password: newPassword });

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