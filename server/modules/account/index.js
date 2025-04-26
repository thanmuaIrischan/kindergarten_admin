const { db } = require('../../config/firebase');
const accountRoutes = require('./routes/accountRoutes');

class AccountService {
    constructor() {
        this.db = db;
    }

    async authenticate(username, password) {
        try {
            const accountsRef = this.db.collection('account');
            const snapshot = await accountsRef.where('username', '==', username).get();
            
            if (snapshot.empty) {
                return { success: false, message: 'User not found' };
            }

            const account = snapshot.docs[0].data();
            if (account.password !== password) {
                return { success: false, message: 'Invalid password' };
            }

            return {
                success: true,
                data: {
                    id: snapshot.docs[0].id,
                    ...account
                }
            };
        } catch (error) {
            console.error('Authentication error:', error);
            return { success: false, message: 'Authentication failed' };
        }
    }

    async getAccountById(id) {
        try {
            const doc = await this.db.collection('account').doc(id).get();
            if (!doc.exists) {
                return { success: false, message: 'Account not found' };
            }
            return { success: true, data: { id: doc.id, ...doc.data() } };
        } catch (error) {
            console.error('Error getting account:', error);
            return { success: false, message: 'Failed to get account' };
        }
    }
}

module.exports = accountRoutes; 