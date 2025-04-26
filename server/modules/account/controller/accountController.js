const accountService = require('../service/accountService');

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

module.exports = {
  authenticate,
  getAccountById
}; 