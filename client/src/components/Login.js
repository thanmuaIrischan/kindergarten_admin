import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(false);
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

        try {
            const response = await axios.post('http://localhost:3001/api/account/authenticate', {
                username,
                password
            });

            if (response.data.success) {
                localStorage.setItem('user', JSON.stringify(response.data.data));
                navigate('/home');
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setError('An error occurred during login');
            console.error(err);
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
        <div className="login-container">
            <div className="login-wallpaper">
                <div className="wallpaper-overlay"></div>
            </div>
            <div className="login-form">
                <div className="login-content">
                    <div className="theme-toggle">
                        <button onClick={toggleTheme} className="theme-toggle-button">
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                    </div>
                    <div className="login-header">
                        <h2>Welcome Back</h2>
                        <p>Please sign in to continue</p>
                    </div>
                    {error && <div className="error-message">{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                placeholder="Enter your username"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                            />
                        </div>
                        <button type="submit" className="login-button">
                            Sign In
                        </button>
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