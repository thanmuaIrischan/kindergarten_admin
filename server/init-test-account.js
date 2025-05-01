const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initTestAccount() {
  try {
    console.log('Checking for admin account...');
    const accountsRef = db.collection('account');
    const snapshot = await accountsRef.where('username', '==', 'admin').get();

    if (snapshot.empty) {
      console.log('Admin account not found. Creating test account...');
      const accountData = {
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        fullName: 'Admin User',
        phoneNumber: '1234567890',
        actor: 'admin_id_1'
      };

      const accountRef = await accountsRef.add(accountData);
      console.log('Test account created with ID:', accountRef.id);
    } else {
      console.log('Admin account already exists:');
      snapshot.forEach(doc => {
        console.log('Document ID:', doc.id);
        console.log('Data:', doc.data());
      });
    }
  } catch (error) {
    console.error('Error initializing test account:', error);
  } finally {
    process.exit();
  }
}

initTestAccount(); 