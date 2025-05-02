import React from 'react';
import { FaTachometerAlt, FaUserGraduate, FaNewspaper, FaUsers, FaSignOutAlt, FaBars, FaChevronLeft, FaChalkboardTeacher, FaCalendarAlt } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const staticNavItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { key: 'students', label: 'Students', icon: <FaUserGraduate /> },
    { key: 'teachers', label: 'Teachers', icon: <FaChalkboardTeacher /> },
    { key: 'class', label: 'Classes', icon: <FaChalkboardTeacher /> },
    { key: 'semester', label: 'Semester', icon: <FaCalendarAlt /> },
    { key: 'news', label: 'News', icon: <FaNewspaper /> },
    { key: 'accounts', label: 'Accounts', icon: <FaUsers /> },
];

function Sidebar({
    selected,
    setSelected,
    onLogout,
    collapsed,
    toggleCollapse,
    visible,
    toggleVisibility
}) {
    if (!visible) {
        return (
            <button className="sidebar-show-btn" onClick={toggleVisibility}>
                <FaBars />
            </button>
        );
    }

    return (
        <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>
            <div className="sidebar-top" style={collapsed ? { marginRight: '16px' } : {}}>
                <button className="sidebar-collapse-btn" onClick={toggleCollapse}>
                    {collapsed ? <FaBars /> : <FaChevronLeft />}
                </button>
                {!collapsed && <div className="sidebar-logo">Kindergarten Admin</div>}
            </div>
            <div className="sidebar-nav">
                {staticNavItems.map(item => (
                    <div
                        key={item.key}
                        className={`sidebar-item${selected === item.key ? ' active' : ''}`}
                        onClick={() => setSelected(item.key)}
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </div>
                ))}
            </div>
            <div className="sidebar-user">
                <button className="sidebar-logout" onClick={onLogout} title="Logout">
                    <FaSignOutAlt /> {!collapsed && 'Logout'}
                </button>
                <button className="sidebar-hide-btn" onClick={toggleVisibility} title="Hide Sidebar">
                    <FaBars />
                </button>
            </div>
        </nav>
    );
}

export default Sidebar; 