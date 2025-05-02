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
import SemesterList from '../../modules/semester/SemesterList';
import SemesterForm from '../../modules/semester/components/SemesterForm';
import SemesterDetails from '../../modules/semester/components/SemesterDetails';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import '../../styles/Home.css';
import '../../styles/Sidebar.css';
import '../../styles/CalendarPanel.css';
import '../../styles/ContentHeader.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
    const [semesterAction, setSemesterAction] = useState(null); // 'list', 'add', or 'edit'
    const [selectedSemester, setSelectedSemester] = useState(null);
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

    useEffect(() => {
        // Reset semester action when changing main navigation
        if (selected !== 'semester') {
            setSemesterAction(null);
            setSelectedSemester(null);
        } else if (!semesterAction) {
            setSemesterAction('list');
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

    const handleSemesterEdit = (semester) => {
        setSelectedSemester(semester);
        setSemesterAction('edit');
    };

    const handleSemesterAdd = () => {
        setSemesterAction('add');
    };

    const handleSemesterView = (semester) => {
        setSelectedSemester(semester);
        setSemesterAction('view');
    };

    const handleSemesterSubmit = async (data) => {
        try {
            if (semesterAction === 'add') {
                await axios.post(`${API_URL}/semester`, data);
            } else {
                await axios.put(`${API_URL}/semester/${selectedSemester.id}`, data);
            }
            setSemesterAction('list');
            setSelectedSemester(null);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to save semester. Please try again.');
        }
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

    const renderSemesterContent = () => {
        switch (semesterAction) {
            case 'list':
                return <SemesterList
                    onEdit={handleSemesterEdit}
                    onAdd={handleSemesterAdd}
                    onViewDetails={handleSemesterView}
                />;
            case 'add':
                return <SemesterForm
                    onSubmit={handleSemesterSubmit}
                    onBack={() => setSemesterAction('list')}
                />;
            case 'edit':
                return <SemesterForm
                    initialData={selectedSemester}
                    onSubmit={handleSemesterSubmit}
                    onBack={() => setSemesterAction('list')}
                />;
            case 'view':
                return <SemesterDetails
                    semester={selectedSemester}
                    onBack={() => setSemesterAction('list')}
                />;
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
                {selected === 'semester' && renderSemesterContent()}
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