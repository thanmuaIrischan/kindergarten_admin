import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import CalendarPanel from './CalendarPanel';
import ContentHeader from './ContentHeader';
import '../../styles/Home.css';
import '../../styles/Sidebar.css';
import '../../styles/CalendarPanel.css';
import '../../styles/ContentHeader.css';
import { FaPuzzlePiece } from 'react-icons/fa';

const Dashboard = () => (
    <div>
        <h2>Welcome to the Kindergarten Admin Dashboard</h2>
        <p>Select a section from the navigation to get started.</p>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(true);
    const [calendarCollapsed, setCalendarCollapsed] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(true);
    const [modules, setModules] = useState([
        // Example: { key: 'custom1', label: 'Custom Module', icon: <FaPuzzlePiece /> }
    ]);
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        console.log('Stored User:', storedUser); // Debug log

        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
            console.log('Parsed User:', parsedUser); // Debug log

            if (!parsedUser || !parsedUser.fullName) {
                throw new Error('Invalid user data');
            }

            setUser(parsedUser);
        } catch (error) {
            console.error('Error parsing user data:', error);
            localStorage.removeItem('user');
            navigate('/login');
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    // Demo: Add a dummy module
    const handleAddModule = () => {
        const newKey = `custom${modules.length + 1}`;
        setModules([
            ...modules,
            { key: newKey, label: `Custom Module ${modules.length + 1}`, icon: <FaPuzzlePiece /> }
        ]);
    };

    const handleRenameModule = (key, newLabel) => {
        setModules(modules.map(m => m.key === key ? { ...m, label: newLabel } : m));
    };

    const handleDeleteModule = (key) => {
        setModules(modules.filter(m => m.key !== key));
    };

    const handleToggleTheme = () => {
        setIsDark(d => !d);
    };

    if (isLoading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="home-layout">
            <Sidebar
                selected={selected}
                onSelect={setSelected}
                user={user}
                onLogout={handleLogout}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                visible={visible}
                setVisible={setVisible}
                modules={modules}
                onAddModule={handleAddModule}
                onRenameModule={handleRenameModule}
                onDeleteModule={handleDeleteModule}
            />
            <main className="main-content">
                <ContentHeader isDark={isDark} onToggleTheme={handleToggleTheme} />
                {selected === 'dashboard' && <Dashboard />}
                {/* Add more content components here based on selected */}
            </main>
            <CalendarPanel
                collapsed={calendarCollapsed}
                setCollapsed={setCalendarCollapsed}
                visible={calendarVisible}
                setVisible={setCalendarVisible}
            />
        </div>
    );
};

export default Home; 