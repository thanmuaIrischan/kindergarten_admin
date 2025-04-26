const { db } = require('../../../config/firebase');

const findByUsername = async (username) => {
  try {
    console.log('Repository: Searching for user:', username);
    const accountsRef = db.collection('account');
    const snapshot = await accountsRef.where('username', '==', username).get();
    
    console.log('Repository: Query result - empty:', snapshot.empty);
    if (snapshot.empty) {
      console.log('Repository: No user found with username:', username);
      return null;
    }

    const doc = snapshot.docs[0];
    console.log('Repository: Found user document:', {
      id: doc.id,
      data: doc.data()
    });

    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Repository error in findByUsername:', error);
    throw error;
  }
};

const findById = async (id) => {
  try {
    console.log('Repository: Searching for user by ID:', id);
    const doc = await db.collection('account').doc(id).get();
    
    console.log('Repository: Document exists:', doc.exists);
    if (!doc.exists) {
      console.log('Repository: No user found with ID:', id);
      return null;
    }

    console.log('Repository: Found user document:', {
      id: doc.id,
      data: doc.data()
    });

    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Repository error in findById:', error);
    throw error;
  }
};

module.exports = {
  findByUsername,
  findById
}; 