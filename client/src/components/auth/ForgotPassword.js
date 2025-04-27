import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1: Phone input, 2: Code verification, 3: New password
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Format phone number to international format
            let formattedPhoneNumber = phoneNumber;
            if (phoneNumber.startsWith('0')) {
                // Replace leading 0 with +84 for Vietnamese numbers
                formattedPhoneNumber = '+84' + phoneNumber.substring(1);
            } else if (!phoneNumber.startsWith('+')) {
                // Add + if missing
                formattedPhoneNumber = '+' + phoneNumber;
            }

            console.log('Sending verification code to:', formattedPhoneNumber);
            const response = await axios.post('http://localhost:3001/api/account/send-verification-code', {
                phoneNumber: formattedPhoneNumber
            });

            if (response.data.success) {
                setStep(2);
            } else {
                setError(response.data.message || 'Failed to send verification code');
            }
        } catch (err) {
            console.error('Error details:', err);
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               err.message || 
                               'An error occurred while sending the verification code';
            setError(`Error: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/account/verify-code', {
                phoneNumber,
                code: verificationCode
            });

            if (response.data.success) {
                setStep(3);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred while verifying the code');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/account/reset-password', {
                phoneNumber,
                code: verificationCode,
                newPassword
            });

            if (response.data.success) {
                navigate('/login');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred while resetting the password');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-content">
                <div className="forgot-password-header">
                    <h2>Reset Password</h2>
                    <p>Please follow the steps to reset your password</p>
                </div>

                {error && (
                    <div className="error-message">
                        <div className="error-title">Error Details:</div>
                        <div className="error-content">{error}</div>
                    </div>
                )}

                {step === 1 && (
                    <form onSubmit={handleSendCode}>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                placeholder="Enter your phone number (e.g., 0858160570)"
                                disabled={isLoading}
                            />
                            <div className="input-hint">
                                Please enter your phone number starting with 0 (e.g., 0858160570)
                                <br />
                                It will be automatically converted to international format (+84)
                            </div>
                        </div>
                        <div className="button-wrapper">
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    'Send Verification Code'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleVerifyCode}>
                        <div className="form-group">
                            <label htmlFor="verificationCode">Verification Code</label>
                            <input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                placeholder="Enter the code sent to your phone"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="button-wrapper">
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    'Verify Code'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Enter your new password"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Confirm your new password"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="button-wrapper">
                            <button type="submit" className="login-button" disabled={isLoading}>
                                {isLoading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    'Reset Password'
                                )}
                            </button>
                        </div>
                    </form>
                )}

                <div className="forgot-password-footer">
                    <button 
                        className="back-to-login" 
                        onClick={() => navigate('/login')}
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword; 