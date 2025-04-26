const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function initTestData() {
    try {
        // Create test account
        const accountData = {
            username: 'admin',
            password: 'admin',
            role: 'admin',
            fullName: 'Admin User',
            phoneNumber: '1234567890',
            actor: 'admin_id_1'
        };

        const accountRef = await db.collection('account').add(accountData);
        console.log('Test account created with ID:', accountRef.id);

        // Create test student
        const studentData = {
            name: 'Test Student',
            dateOfBirth: '2020-01-01',
            gender: 'male',
            address: '123 Test Street',
            parentId: 'parent_id_1',
            classId: 'class_id_1'
        };

        const studentRef = await db.collection('students').add(studentData);
        console.log('Test student created with ID:', studentRef.id);

        // Create test news
        const newsData = {
            title: 'Welcome to Kindergarten',
            content: 'This is a test news article.',
            author: 'Admin User',
            createdAt: new Date(),
            imageUrl: 'https://example.com/image.jpg'
        };

        const newsRef = await db.collection('news').add(newsData);
        console.log('Test news created with ID:', newsRef.id);

        console.log('Test data initialization completed successfully!');
    } catch (error) {
        console.error('Error initializing test data:', error);
    } finally {
        process.exit();
    }
}

initTestData(); 