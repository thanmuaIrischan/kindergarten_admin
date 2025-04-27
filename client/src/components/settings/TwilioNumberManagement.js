import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TwilioNumberManagement.css';

const TwilioNumberManagement = () => {
    const [availableNumbers, setAvailableNumbers] = useState([]);
    const [purchasedNumbers, setPurchasedNumbers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [countryCode, setCountryCode] = useState('VN'); // Default to Vietnam
    const [areaCode, setAreaCode] = useState('');

    const searchNumbers = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/api/twilio/search-numbers', {
                countryCode,
                areaCode
            });
            setAvailableNumbers(response.data.numbers);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to search for numbers');
        } finally {
            setLoading(false);
        }
    };

    const purchaseNumber = async (phoneNumber) => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://localhost:3001/api/twilio/purchase-number', {
                phoneNumber
            });
            // Refresh purchased numbers list
            await fetchPurchasedNumbers();
            setAvailableNumbers(availableNumbers.filter(num => num !== phoneNumber));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to purchase number');
        } finally {
            setLoading(false);
        }
    };

    const fetchPurchasedNumbers = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/twilio/numbers');
            setPurchasedNumbers(response.data.numbers);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch purchased numbers');
        }
    };

    useEffect(() => {
        fetchPurchasedNumbers();
    }, []);

    return (
        <div className="twilio-management-container">
            <div className="twilio-header">
                <h2>Twilio Phone Number Management</h2>
                <p>Purchase and manage phone numbers for sending verification codes</p>
            </div>

            {error && (
                <div className="error-message">
                    <div className="error-title">Error:</div>
                    <div className="error-content">{error}</div>
                </div>
            )}

            <div className="search-section">
                <h3>Search Available Numbers</h3>
                <div className="search-filters">
                    <div className="form-group">
                        <label htmlFor="countryCode">Country Code</label>
                        <select
                            id="countryCode"
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                        >
                            <option value="VN">Vietnam (+84)</option>
                            <option value="US">United States (+1)</option>
                            <option value="GB">United Kingdom (+44)</option>
                            {/* Add more countries as needed */}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="areaCode">Area Code (Optional)</label>
                        <input
                            type="text"
                            id="areaCode"
                            value={areaCode}
                            onChange={(e) => setAreaCode(e.target.value)}
                            placeholder="e.g., 212"
                        />
                    </div>
                    <button 
                        className="search-button"
                        onClick={searchNumbers}
                        disabled={loading}
                    >
                        {loading ? 'Searching...' : 'Search Numbers'}
                    </button>
                </div>
            </div>

            <div className="numbers-section">
                <div className="available-numbers">
                    <h3>Available Numbers</h3>
                    {availableNumbers.length > 0 ? (
                        <ul className="numbers-list">
                            {availableNumbers.map((number) => (
                                <li key={number} className="number-item">
                                    <span className="number">{number}</span>
                                    <button
                                        className="purchase-button"
                                        onClick={() => purchaseNumber(number)}
                                        disabled={loading}
                                    >
                                        Purchase
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-numbers">No numbers available. Try a different search.</p>
                    )}
                </div>

                <div className="purchased-numbers">
                    <h3>Your Purchased Numbers</h3>
                    {purchasedNumbers.length > 0 ? (
                        <ul className="numbers-list">
                            {purchasedNumbers.map((number) => (
                                <li key={number} className="number-item">
                                    <span className="number">{number}</span>
                                    <span className="status active">Active</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="no-numbers">No purchased numbers yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TwilioNumberManagement; 