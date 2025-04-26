const admin = require('firebase-admin');
const serviceAccount = require('./config/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function checkAccount() {
  try {
    console.log('Checking account collection...');
    const accountsRef = db.collection('account');
    const snapshot = await accountsRef.where('username', '==', 'admin').get();

    if (snapshot.empty) {
      console.log('No admin account found!');
      return;
    }

    console.log('Found admin account:');
    snapshot.forEach(doc => {
      console.log('Document ID:', doc.id);
      console.log('Data:', doc.data());
    });
  } catch (error) {
    console.error('Error checking account:', error);
  } finally {
    process.exit();
  }
}

checkAccount(); 