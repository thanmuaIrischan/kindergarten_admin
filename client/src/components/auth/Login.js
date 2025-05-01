import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSun, FaMoon, FaSchool } from 'react-icons/fa';
import { useTheme } from '../../context/ThemeContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { isDark, toggleTheme } = useTheme();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            console.log('Attempting login with:', { username, password });

            const response = await axios.post('http://localhost:3001/api/account/authenticate', {
                username,
                password
            });

            console.log('Login response:', response.data);

            if (response.data.success && response.data.data) {
                // Store the user data in localStorage
                localStorage.setItem('user', JSON.stringify(response.data.data));
                console.log('User data stored:', response.data.data);

                // Navigate to home page
                setIsLoading(false);
                navigate('/home');
            } else {
                const errorMessage = response.data.message || 'Login failed';
                console.error('Login failed:', errorMessage);
                setError(errorMessage);
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login error:', err);
            const errorMessage = err.response?.data?.message || 'An error occurred during login';
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <div className={`login-container ${isDark ? 'dark' : ''}`}>
            <div className="login-wallpaper">
                <div className="wallpaper-overlay"></div>
                <div className="wallpaper-content">
                    <FaSchool className="school-icon" />
                    <h1>Kindergarten Admin</h1>
                    <p>Manage your kindergarten with ease and efficiency</p>
                </div>
            </div>

            <div className="login-form">
                <div className="login-content">
                    <div className="theme-toggle">
                        <button
                            className="theme-toggle-button"
                            onClick={toggleTheme}
                            aria-label="Toggle theme"
                        >
                            {isDark ? <FaSun /> : <FaMoon />}
                        </button>
                    </div>

                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Please sign in to continue</p>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>
                                <FaUser className="input-icon" />
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter your username"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                <FaLock className="input-icon" />
                                Password
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="login-button"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="loading-spinner">
                                        <div className="spinner"></div>
                                    </div>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login; 