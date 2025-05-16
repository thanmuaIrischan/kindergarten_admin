import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/ContentHeader.css';

const ContentHeader = ({ onSearch, staticNavItems = [], setSelected }) => {
    const { isDark, toggleTheme } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowSuggestions(value.length > 0);

        if (onSearch && staticNavItems) {
            const filteredItems = staticNavItems.filter(item => 
                item.label.toLowerCase().includes(value.toLowerCase())
            );
            onSearch(value, filteredItems);
        }
    };

    const handleSuggestionClick = (item) => {
        setSelected(item.key);
        setSearchTerm('');
        setShowSuggestions(false);
    };

    // Close suggestions when clicking outside
    const handleClickOutside = () => {
        setShowSuggestions(false);
    };

    return (
        <div className="header-container">
            <div className="content">
                <div className="search-container">
                    <div className="search-bar">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search modules..."
                            value={searchTerm}
                            onChange={handleSearch}
                            onFocus={() => setShowSuggestions(searchTerm.length > 0)}
                        />
                    </div>
                    {showSuggestions && staticNavItems && (
                        <div className="search-suggestions">
                            {staticNavItems
                                .filter(item => 
                                    item.label.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(item => (
                                    <div 
                                        key={item.key} 
                                        className="suggestion-item"
                                        onClick={() => handleSuggestionClick(item)}
                                    >
                                        <span className="suggestion-icon">{item.icon}</span>
                                        <span className="suggestion-label">{item.label}</span>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
                <div className="theme-toggle">
                    <span className="icon sun">☀️</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={isDark}
                            onChange={toggleTheme}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span className="icon moon">🌙</span>
                </div>
            </div>
        </div>
    );
};

export default ContentHeader;
