import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSun, FaMoon, FaSchool } from 'react-icons/fa';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if dark mode is enabled in localStorage
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:3001/api/account/authenticate', {
                username,
                password
            });

            console.log('Login Response:', response.data); // Debug log

            if (response.data.success) {
                // Check the actual structure of the response
                const userData = response.data.data || response.data.user;
                console.log('User Data:', userData); // Debug log

                if (!userData) {
                    throw new Error('No user data received');
                }

                localStorage.setItem('user', JSON.stringify(userData));
                setIsLoading(false);
                navigate('/home');
            } else {
                setError(response.data.message || 'Login failed');
                setIsLoading(false);
            }
        } catch (err) {
            console.error('Login Error:', err); // Debug log
            setError(err.response?.data?.message || 'An error occurred during login');
            setIsLoading(false);
        }
    };

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        if (!isDarkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <div className={`login-container ${isDarkMode ? 'dark' : ''}`}>
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
                            {isDarkMode ? <FaSun /> : <FaMoon />}
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

                    <form onSubmit={handleLogin} className="login-form-container">
                        <div className="form-group">
                            <label htmlFor="username">
                                <FaUser className="input-icon" />
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">
                                <FaLock className="input-icon" />
                                Password
                            </label>
                            <div className="password-input-container">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    placeholder="Enter your password"
                                    className="password-input"
                                />
                                <button
                                    type="button"
                                    className={`password-toggle ${showPassword ? 'visible' : ''}`}
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        <div className="form-options">
                            <div className="remember-me">
                                <input type="checkbox" id="remember" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <a href="/forgot-password" className="forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <div className="login-button-container">
                            {isLoading ? (
                                <div className="loading-spinner">
                                    <div className="spinner"></div>
                                </div>
                            ) : (
                                <button type="submit" className="login-button">
                                    Sign In
                                </button>
                            )}
                        </div>
                    </form>

                    <div className="login-footer">
                        <p>© 2024 Kindergarten Admin. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login; 