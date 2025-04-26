const accountRepository = require('../repository/accountRepository');

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

module.exports = {
  authenticate,
  getAccountById
}; 