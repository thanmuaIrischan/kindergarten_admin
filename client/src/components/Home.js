import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(storedUser));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return null; // or a loading spinner
    }

    return (
        <div className="home-container">
            <header className="header">
                <h1>Kindergarten Admin Dashboard</h1>
                <div className="user-info">
                    <span>Welcome, {user.fullName}</span>
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                </div>
            </header>
            
            <nav className="navigation">
                <button onClick={() => navigate('/students')} className="nav-button">
                    Students
                </button>
                <button onClick={() => navigate('/news')} className="nav-button">
                    News
                </button>
                <button onClick={() => navigate('/accounts')} className="nav-button">
                    Accounts
                </button>
            </nav>

            <main className="main-content">
                <h2>Welcome to the Kindergarten Admin Dashboard</h2>
                <p>Select a section from the navigation above to get started.</p>
            </main>
        </div>
    );
};

export default Home; 