import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaSun, FaMoon, FaSchool, FaExclamationTriangle } from 'react-icons/fa';
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
        password,
      });

      console.log('Login response:', response.data);

      if (response.data.success && response.data.data) {
        if (response.data.data.role !== 'admin') {
          setError('Access Denied. Only administrators are allowed to access this system.');
          setIsLoading(false);
          return;
        }

        localStorage.setItem('user', JSON.stringify(response.data.data));
        console.log('User data stored:', response.data.data);
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
      let errorMessage;
      
      if (err.response) {
        if (err.response.data && err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (err.response.status === 401) {
          errorMessage = 'Access denied. Only administrators are allowed to access this system.';
        } else {
          errorMessage = 'Login failed. Please try again.';
        }
      } else if (err.request) {
        errorMessage = 'Unable to connect to server. Please try again later.';
      } else {
        errorMessage = 'An error occurred. Please try again.';
      }
      
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
        <div className="login-card">
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
            <p>Sign in to continue</p>
          </div>

          {error && (
            <div className="error-message-container">
              <div className="error-message">
                <FaExclamationTriangle className="error-icon" />
                <span className="error-text">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className={`form-group ${error ? 'has-error' : ''}`}>
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
                className={error ? 'error-input' : ''}
              />
            </div>

            <div className={`form-group ${error ? 'has-error' : ''}`}>
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
                  className={error ? 'error-input' : ''}
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
                className={`login-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          </form>

          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;