import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import ContentHeader from './ContentHeader';
import Dashboard from '../dashboard/Dashboard';
import CalendarPanel from './CalendarPanel';
import StudentList from '../../modules/student/StudentList';
import AddStudent from '../../modules/student/AddStudent';
import EditStudent from '../../modules/student/EditStudent';
import StudentDetails from '../../modules/student/components/StudentDetails';
import ClassList from '../../modules/class/ClassList';
import AddClass from '../../modules/class/components/AddClass';
import EditClass from '../../modules/class/components/EditClass';
import SemesterList from '../../modules/semester/SemesterList';
import SemesterForm from '../../modules/semester/components/SemesterForm';
import SemesterDetails from '../../modules/semester/components/SemesterDetails';
import TeacherList from '../../modules/teacher/components/TeacherList';
import AddTeacher from '../../modules/teacher/components/AddTeacher';
import EditTeacher from '../../modules/teacher/components/EditTeacher';
import TeacherDetails from '../../modules/teacher/components/TeacherDetails';
import { useTheme } from '../../context/ThemeContext';
import axios from 'axios';
import '../../styles/Home.css';
import '../../styles/Sidebar.css';
import '../../styles/CalendarPanel.css';
import '../../styles/ContentHeader.css';
import { FaChevronLeft } from 'react-icons/fa';

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
    const [studentAction, setStudentAction] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [semesterAction, setSemesterAction] = useState(null);
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [classAction, setClassAction] = useState(null);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [teacherAction, setTeacherAction] = useState('list');
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            const parsedUser = JSON.parse(storedUser);
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
        // Reset actions when changing main navigation
        if (selected !== 'students') {
            setStudentAction(null);
            setSelectedStudentId(null);
            setSelectedStudent(null);
        } else if (!studentAction) {
            setStudentAction('list');
        }

        if (selected !== 'semester') {
            setSemesterAction(null);
            setSelectedSemester(null);
        } else if (!semesterAction) {
            setSemesterAction('list');
        }

        if (selected !== 'class') {
            setClassAction(null);
            setSelectedClassId(null);
        } else if (!classAction) {
            setClassAction('list');
        }

        // Initialize teacher action to list only when first navigating to teachers
        if (selected === 'teachers' && !teacherAction) {
            setTeacherAction('list');
        }
    }, [selected, studentAction, semesterAction, classAction, teacherAction]);

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

    const handleClassCreate = () => {
        setClassAction('create');
    };

    const handleClassEdit = (classId) => {
        setSelectedClassId(classId);
        setClassAction('edit');
    };

    const handleBackToClassList = () => {
        setClassAction('list');
        setSelectedClassId(null);
    };

    const handleTeacherAdd = () => {
        setTeacherAction('add');
    };

    const handleBackToTeacherList = () => {
        setTeacherAction('list');
    };

    const handleTeacherEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setTeacherAction('edit');
    };

    const handleTeacherView = (teacher) => {
        setSelectedTeacher(teacher);
        setTeacherAction('view');
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

    const renderClassContent = () => {
        switch (classAction) {
            case 'list':
                return <ClassList
                    onEdit={handleClassEdit}
                    onAdd={handleClassCreate}
                />;
            case 'create':
                return <AddClass onBack={handleBackToClassList} />;
            case 'edit':
                return <EditClass id={selectedClassId} onBack={handleBackToClassList} />;
            default:
                return null;
        }
    };

    const renderTeacherContent = () => {
        switch (teacherAction) {
            case 'list':
                return <TeacherList
                    onAdd={handleTeacherAdd}
                    onEdit={handleTeacherEdit}
                    onViewDetails={handleTeacherView}
                />;
            case 'add':
                return <AddTeacher onBack={handleBackToTeacherList} />;
            case 'edit':
                return <EditTeacher
                    teacher={selectedTeacher}
                    onBack={handleBackToTeacherList}
                />;
            case 'view':
                return <TeacherDetails
                    teacher={selectedTeacher}
                    onBack={handleBackToTeacherList}
                />;
            default:
                return null;
        }
    };

    return (
        <div className={`home-container ${isDark ? 'dark' : ''}`}>
            <Sidebar
                collapsed={collapsed}
                visible={visible}
                selected={selected}
                setSelected={setSelected}
                onLogout={handleLogout}
                toggleCollapse={() => setCollapsed(!collapsed)}
                toggleVisibility={() => setVisible(!visible)}
            />
            <div className={`main-content ${collapsed ? 'expanded' : ''} ${!visible ? 'full' : ''}`}>
                <ContentHeader
                    user={user}
                    isDark={isDark}
                    toggleTheme={toggleTheme}
                />
                <div className="content-wrapper">
                    <div className="content">
                        {selected === 'dashboard' && <Dashboard />}
                        {selected === 'students' && renderStudentContent()}
                        {selected === 'class' && renderClassContent()}
                        {selected === 'semester' && renderSemesterContent()}
                        {selected === 'teachers' && renderTeacherContent()}
                    </div>
                    {calendarVisible && (
                        <CalendarPanel
                            collapsed={calendarCollapsed}
                            toggleCollapse={() => setCalendarCollapsed(!calendarCollapsed)}
                            toggleVisibility={() => setCalendarVisible(false)}
                        />
                    )}
                    {!calendarVisible && (
                        <button
                            className="calendar-show-btn"
                            onClick={() => setCalendarVisible(true)}
                            title="Show Calendar"
                        >
                            <FaChevronLeft />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home; 