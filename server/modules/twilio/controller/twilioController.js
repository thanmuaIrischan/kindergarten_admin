const twilio = require('twilio');
const { db } = require('../../../config/firebase');

// Initialize Twilio client
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

const searchNumbers = async (req, res) => {
    try {
        const { countryCode, areaCode } = req.body;
        
        // Search for available phone numbers
        const numbers = await twilioClient.availablePhoneNumbers(countryCode)
            .local
            .list({
                areaCode: areaCode || undefined,
                limit: 10
            });

        res.json({
            success: true,
            numbers: numbers.map(number => number.phoneNumber)
        });
    } catch (error) {
        console.error('Error searching for numbers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search for phone numbers',
            error: error.message
        });
    }
};

const purchaseNumber = async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        
        // Purchase the phone number
        const purchasedNumber = await twilioClient.incomingPhoneNumbers
            .create({ phoneNumber });

        // Store the purchased number in the database
        await db.collection('twilioNumbers').doc(phoneNumber).set({
            phoneNumber,
            sid: purchasedNumber.sid,
            dateCreated: new Date(),
            status: 'active'
        });

        res.json({
            success: true,
            message: 'Phone number purchased successfully',
            number: purchasedNumber.phoneNumber
        });
    } catch (error) {
        console.error('Error purchasing number:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to purchase phone number',
            error: error.message
        });
    }
};

const getPurchasedNumbers = async (req, res) => {
    try {
        // Get all purchased numbers from the database
        const snapshot = await db.collection('twilioNumbers').get();
        const numbers = [];
        
        snapshot.forEach(doc => {
            numbers.push(doc.data().phoneNumber);
        });

        res.json({
            success: true,
            numbers
        });
    } catch (error) {
        console.error('Error getting purchased numbers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get purchased numbers',
            error: error.message
        });
    }
};

module.exports = {
    searchNumbers,
    purchaseNumber,
    getPurchasedNumbers
}; 