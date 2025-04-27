import React from 'react';
import '../../styles/ContentHeader.css';

const ContentHeader = ({ isDark, onToggleTheme }) => (
    <div className="header-container">
        <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
                type="text"
                className="form-control"
                placeholder="Search Courses, Documents, Activities..."
                disabled
            />
        </div>
        <div className="theme-toggle">
            <span className="icon sun">☀️</span>
            <label className="switch">
                <input type="checkbox" checked={isDark} onChange={onToggleTheme} />
                <span className="slider round"></span>
            </label>
            <span className="icon moon">🌙</span>
        </div>
    </div>
);

export default ContentHeader; 