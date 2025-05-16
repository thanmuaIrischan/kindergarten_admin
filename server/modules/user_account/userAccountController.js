const { db } = require('../../config/firebase');
const admin = require('firebase-admin');

// Verify Firebase connection
const verifyDbConnection = async () => {
  try {
    await db.collection('account').limit(1).get();
    return true;
  } catch (error) {
    console.error('Firebase connection error:', error);
    return false;
  }
};

const getAllAccounts = async (req, res) => {
  try {
    console.log('Getting all accounts');
    const accountsSnapshot = await db.collection('account').get();
    const accounts = [];
    accountsSnapshot.forEach(doc => {
      accounts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    console.log('Found accounts:', accounts.length);
    res.json(accounts);
  } catch (error) {
    console.error('Error getting accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
};

const getAccountById = async (req, res) => {
  try {
    const accountDoc = await db.collection('account').doc(req.params.id).get();
    if (!accountDoc.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({
      id: accountDoc.id,
      ...accountDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch account' });
  }
};

const createAccount = async (req, res) => {
  try {
    console.log('Creating new account with body:', req.body);
    const { username, password, fullName, role, phoneNumber } = req.body;
    
    if (!username || !password || !fullName || !role || !phoneNumber) {
      console.error('Missing required fields:', { username, fullName, role, phoneNumber });
      return res.status(400).json({ error: 'All fields are required' });
    }
    
    console.log('Checking for existing username:', username);
    try {
      const existingUser = await db.collection('account')
        .where('username', '==', username)
        .get();
      
      if (!existingUser.empty) {
        console.log('Username already exists:', username);
        return res.status(400).json({ error: 'Username already exists' });
      }
    } catch (error) {
      console.error('Error checking existing username:', error);
      return res.status(500).json({ error: 'Failed to check username availability' });
    }

    console.log('Creating new account in database');
    try {
      // Create account document data
                  const accountData = {        username,        password,        fullName,        role,        phoneNumber      };

      // Add the document to Firestore
      const docRef = await db.collection('account').add(accountData);
      
      // Fetch the created document
      const newAccountDoc = await docRef.get();
      const responseData = {
        id: newAccountDoc.id,
        ...newAccountDoc.data()
      };

      console.log('Account created successfully:', responseData);
      res.status(201).json(responseData);
    } catch (error) {
      console.error('Error in database operation:', error);
      return res.status(500).json({ 
        error: 'Failed to create account in database',
        details: error.message 
      });
    }
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ 
      error: 'Failed to create account',
      details: error.message
    });
  }
};

const updateAccount = async (req, res) => {
  try {
    const { username, password, fullName, role, phoneNumber } = req.body;
    const accountRef = db.collection('account').doc(req.params.id);
    
    const accountDoc = await accountRef.get();
    if (!accountDoc.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // If username is being changed, check if new username already exists
    if (username && username !== accountDoc.data().username) {
      const existingUser = await db.collection('account')
        .where('username', '==', username)
        .get();
      
      if (!existingUser.empty) {
        return res.status(400).json({ error: 'Username already exists' });
      }
    }

    const updateData = {
      ...(username && { username }),
      ...(password && { password }),
      ...(fullName && { fullName }),
      ...(role && { role }),
      ...(phoneNumber && { phoneNumber })
    };

    await accountRef.update(updateData);
    
    const updatedAccount = await accountRef.get();
    res.json({
      id: updatedAccount.id,
      ...updatedAccount.data()
    });
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ 
      error: 'Failed to update account',
      details: error.message 
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const accountRef = db.collection('account').doc(req.params.id);
    const accountDoc = await accountRef.get();
    
    if (!accountDoc.exists) {
      return res.status(404).json({ error: 'Account not found' });
    }

    await accountRef.delete();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ 
      error: 'Failed to delete account',
      details: error.message 
    });
  }
};

module.exports = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount
}; 