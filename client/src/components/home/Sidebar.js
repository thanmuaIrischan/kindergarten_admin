import React, { useState } from 'react';
import { FaTachometerAlt, FaUserGraduate, FaNewspaper, FaUsers, FaSignOutAlt, FaBars, FaChevronLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/Sidebar.css';

const staticNavItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { key: 'students', label: 'Students', icon: <FaUserGraduate /> },
    { key: 'news', label: 'News', icon: <FaNewspaper /> },
    { key: 'accounts', label: 'Accounts', icon: <FaUsers /> },
];

const Sidebar = ({
    selected, onSelect, user, onLogout,
    collapsed, setCollapsed, visible, setVisible,
    modules, onAddModule, onRenameModule, onDeleteModule
}) => {
    const [editingKey, setEditingKey] = useState(null);
    const [editValue, setEditValue] = useState('');

    if (!visible) {
        return (
            <button className="sidebar-show-btn" onClick={() => setVisible(true)}>
                <FaBars />
            </button>
        );
    }

    const handleEdit = (key, label) => {
        setEditingKey(key);
        setEditValue(label);
    };

    const handleEditSubmit = (key) => {
        if (editValue.trim()) {
            onRenameModule(key, editValue.trim());
        }
        setEditingKey(null);
        setEditValue('');
    };

    return (
        <nav className={`sidebar${collapsed ? ' collapsed' : ''}`}>
            <div className="sidebar-top" style={collapsed ? { marginRight: '16px' } : {}}>
                <button className="sidebar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <FaBars /> : <FaChevronLeft />}
                </button>
                {!collapsed && <div className="sidebar-logo">Kindergarten Admin</div>}
            </div>
            <div className="sidebar-nav">
                {[...staticNavItems].map(item => (
                    <div
                        key={item.key}
                        className={`sidebar-item${selected === item.key ? ' active' : ''}`}
                        onClick={() => onSelect(item.key)}
                        title={collapsed ? item.label : undefined}
                    >
                        {item.icon}
                        {!collapsed && <span>{item.label}</span>}
                    </div>
                ))}
                {modules.map(item => (
                    <div
                        key={item.key}
                        className={`sidebar-item module-item${selected === item.key ? ' active' : ''}`}
                        title={collapsed ? item.label : undefined}
                        style={{ position: 'relative' }}
                    >
                        {item.icon}
                        {!collapsed && (
                            <>
                                {editingKey === item.key ? (
                                    <form
                                        onSubmit={e => { e.preventDefault(); handleEditSubmit(item.key); }}
                                        style={{ display: 'inline', marginLeft: 4 }}
                                    >
                                        <input
                                            className="sidebar-edit-input"
                                            value={editValue}
                                            onChange={e => setEditValue(e.target.value)}
                                            autoFocus
                                            onBlur={() => handleEditSubmit(item.key)}
                                            style={{ fontSize: '0.92rem', width: 90 }}
                                        />
                                    </form>
                                ) : (
                                    <span style={{ marginRight: 8 }}>{item.label}</span>
                                )}
                                <button
                                    className="sidebar-module-btn"
                                    onClick={() => handleEdit(item.key, item.label)}
                                    tabIndex={-1}
                                    title="Rename"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    className="sidebar-module-btn"
                                    onClick={() => onDeleteModule(item.key)}
                                    tabIndex={-1}
                                    title="Delete"
                                >
                                    <FaTrash />
                                </button>
                            </>
                        )}
                    </div>
                ))}
                {!collapsed && (
                    <button className="sidebar-add-module" onClick={onAddModule}>
                        <FaPlus /> Add Module
                    </button>
                )}
            </div>
            <div className="sidebar-user">
                {!collapsed && (
                    <div className="sidebar-user-info">
                        <span>{user.fullName}</span>
                    </div>
                )}
                <button className="sidebar-logout" onClick={onLogout} title="Logout">
                    <FaSignOutAlt /> {!collapsed && 'Logout'}
                </button>
                <button className="sidebar-hide-btn" onClick={() => setVisible(false)} title="Hide Sidebar">
                    <FaBars />
                </button>
            </div>
        </nav>
    );
};

export default Sidebar; 