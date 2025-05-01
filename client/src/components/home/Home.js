import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ContentHeader from './ContentHeader';
import Dashboard from '../dashboard/Dashboard';
import CalendarPanel from '../calendar/CalendarPanel';
import StudentList from '../../modules/student/StudentList';
import AddStudent from '../../modules/student/AddStudent';
import EditStudent from '../../modules/student/EditStudent';
import StudentDetails from '../../modules/student/components/StudentDetails';
import ClassList from '../../modules/class/ClassList';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/Home.css';
import '../../styles/Sidebar.css';
import '../../styles/CalendarPanel.css';
import '../../styles/ContentHeader.css';

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const [visible, setVisible] = useState(true);
    const [calendarCollapsed, setCalendarCollapsed] = useState(false);
    const [calendarVisible, setCalendarVisible] = useState(true);
    const [studentAction, setStudentAction] = useState(null); // 'list', 'add', 'edit', or 'view'
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { isDark, toggleTheme } = useTheme();

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

    useEffect(() => {
        // Reset student action when changing main navigation
        if (selected !== 'students') {
            setStudentAction(null);
            setSelectedStudentId(null);
            setSelectedStudent(null);
        } else if (!studentAction) {
            setStudentAction('list');
        }
    }, [selected]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleStudentEdit = (studentId) => {
        setSelectedStudentId(studentId);
        setStudentAction('edit');
    };

    const handleStudentAdd = () => {
        setStudentAction('add');
    };

    const handleStudentView = (student) => {
        setSelectedStudent(student);
        setStudentAction('view');
    };

    const handleBackToList = () => {
        setStudentAction('list');
        setSelectedStudentId(null);
        setSelectedStudent(null);
    };

    if (isLoading) {
        return <div className="loading-container">Loading...</div>;
    }

    if (!user) {
        return null;
    }

    const renderStudentContent = () => {
        switch (studentAction) {
            case 'list':
                return <StudentList
                    onEdit={handleStudentEdit}
                    onAdd={handleStudentAdd}
                    onViewDetails={handleStudentView}
                />;
            case 'add':
                return <AddStudent onBack={handleBackToList} />;
            case 'edit':
                return <EditStudent id={selectedStudentId} onBack={handleBackToList} />;
            case 'view':
                return selectedStudent ? (
                    <StudentDetails
                        student={selectedStudent}
                        onBack={handleBackToList}
                    />
                ) : null;
            default:
                return null;
        }
    };

    return (
        <div className={`home-layout ${isDark ? 'dark' : ''}`}>
            <Sidebar
                selected={selected}
                onSelect={setSelected}
                user={user}
                onLogout={handleLogout}
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                visible={visible}
                setVisible={setVisible}
            />
            <main className="main-content">
                <ContentHeader isDark={isDark} onToggleTheme={toggleTheme} />
                {selected === 'dashboard' && <Dashboard />}
                {selected === 'students' && renderStudentContent()}
                {selected === 'classes' && <ClassList />}
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