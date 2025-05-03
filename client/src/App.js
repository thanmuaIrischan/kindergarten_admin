// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Login from './components/auth/Login';
import ForgotPassword from './components/auth/ForgotPassword';
import Home from './components/home/Home';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

const App = () => {
  return (
    <ThemeProvider>
      <SnackbarProvider maxSnack={3}>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/home/*" element={<Home />} />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
