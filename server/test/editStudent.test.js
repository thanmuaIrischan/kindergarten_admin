const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3001/api';

// Test data with the correct structure
const testStudent = {
    firstName: "John",
    lastName: "Doe",
    dateOfBirth: "01-01-2020",
    gender: "male",
    gradeLevel: "K1",
    school: "Test School",
    class: "Class A",
    educationSystem: "International",
    motherName: "Jane Doe",
    fatherOccupation: "Engineer",
    motherOccupation: "Doctor",
    studentID: "TEST_" + Date.now(),
    image: {
        url: "https://example.com/image.jpg",
        public_id: "test/image"
    },
    birthCertificate: {
        url: "https://example.com/birth.pdf",
        public_id: "test/birth"
    },
    householdRegistration: {
        url: "https://example.com/household.pdf",
        public_id: "test/household"
    }
};

async function runTests() {
    try {
        console.log('Starting edit student tests...');

        // First, create a test student
        console.log('Creating test student with data:', JSON.stringify(testStudent, null, 2));
        const createResponse = await axios.post(`${API_URL}/student`, testStudent);
        console.log('Create response:', createResponse.data);
        const studentId = testStudent.studentID;
        console.log('Created student with ID:', studentId);

        // Test Case 1: Update single field
        console.log('\nTest Case 1: Update single field');
        const singleFieldUpdate = {
            firstName: "Jane",
            lastName: "Doe"
        };
        console.log('Sending update:', JSON.stringify(singleFieldUpdate, null, 2));
        const result1 = await axios.put(`${API_URL}/student/${studentId}`, singleFieldUpdate);
        console.log('Single field update result:', result1.data);

        // Verify the update didn't overwrite other fields
        const verify1 = await axios.get(`${API_URL}/student/${studentId}`);
        console.log('Verification after single field update:', verify1.data);

        // Test Case 2: Update multiple fields
        console.log('\nTest Case 2: Update multiple fields');
        const multiFieldUpdate = {
            firstName: "Janet",
            lastName: "Smith",
            gradeLevel: "K2",
            class: "Class B"
        };
        console.log('Sending update:', JSON.stringify(multiFieldUpdate, null, 2));
        const result2 = await axios.put(`${API_URL}/student/${studentId}`, multiFieldUpdate);
        console.log('Multiple field update result:', result2.data);

        // Verify the update
        const verify2 = await axios.get(`${API_URL}/student/${studentId}`);
        console.log('Verification after multiple field update:', verify2.data);

        // Test Case 3: Update with document
        console.log('\nTest Case 3: Update with document');
        const documentUpdate = {
            firstName: "Janet",
            lastName: "Smith",
            image: {
                url: "https://new-image-url.com",
                public_id: "new_image_id"
            }
        };
        console.log('Sending update:', JSON.stringify(documentUpdate, null, 2));
        const result3 = await axios.put(`${API_URL}/student/${studentId}`, documentUpdate);
        console.log('Document update result:', result3.data);

        // Verify the update
        const verify3 = await axios.get(`${API_URL}/student/${studentId}`);
        console.log('Verification after document update:', verify3.data);

        // Test Case 4: Empty update (should preserve data)
        console.log('\nTest Case 4: Empty update');
        const emptyUpdate = {};
        console.log('Sending update:', JSON.stringify(emptyUpdate, null, 2));
        const result4 = await axios.put(`${API_URL}/student/${studentId}`, emptyUpdate);
        console.log('Empty update result:', result4.data);

        // Verify the update
        const verify4 = await axios.get(`${API_URL}/student/${studentId}`);
        console.log('Verification after empty update:', verify4.data);

        // Verify no data loss
        function compareObjects(obj1, obj2, path = '') {
            const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)]);
            for (const key of allKeys) {
                const fullPath = path ? `${path}.${key}` : key;
                if (!(key in obj1)) {
                    console.log(`Missing key in original data: ${fullPath}`);
                } else if (!(key in obj2)) {
                    console.log(`Missing key in updated data: ${fullPath}`);
                } else if (typeof obj1[key] === 'object' && obj1[key] !== null &&
                           typeof obj2[key] === 'object' && obj2[key] !== null) {
                    compareObjects(obj1[key], obj2[key], fullPath);
                } else if (obj1[key] !== obj2[key]) {
                    console.log(`Value changed for ${fullPath}: ${obj1[key]} -> ${obj2[key]}`);
                }
            }
        }

        // Final verification with detailed comparison
        console.log('\nFinal data verification');
        const finalVerify = await axios.get(`${API_URL}/student/${studentId}`);
        console.log('Comparing initial data with final data:');
        compareObjects(testStudent, finalVerify.data.data);

        // Cleanup
        console.log('\nCleaning up...');
        await axios.delete(`${API_URL}/student/${studentId}`);
        console.log('Test student deleted');

        console.log('\nAll tests completed successfully!');
    } catch (error) {
        console.error('Test error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Error details:', JSON.stringify(error.response.data, null, 2));
        }
        if (error.response) {
            console.error('Full error response:', error.response);
        }
        process.exit(1);
    }
}

// Run the tests
runTests(); 