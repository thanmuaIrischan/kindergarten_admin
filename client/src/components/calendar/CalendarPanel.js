import React, { useState } from 'react';
import { FaBars, FaChevronRight, FaPlus } from 'react-icons/fa';
import '../../styles/CalendarPanel.css';

const CalendarPanel = ({
    collapsed,
    setCollapsed,
    visible,
    setVisible
}) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([
        {
            id: 1,
            title: 'Staff Meeting',
            date: new Date(2024, 3, 15, 10, 0),
            type: 'meeting'
        },
        {
            id: 2,
            title: 'Parent Conference',
            date: new Date(2024, 3, 16, 14, 30),
            type: 'conference'
        }
    ]);

    if (!visible) {
        return (
            <button className="calendar-show-btn" onClick={() => setVisible(true)}>
                <FaChevronRight />
            </button>
        );
    }

    const handleAddEvent = () => {
        // TODO: Implement event creation
        console.log('Add event clicked');
    };

    return (
        <aside className={`calendar-panel${collapsed ? ' collapsed' : ''}`}>
            <div className="calendar-header">
                <button className="calendar-collapse-btn" onClick={() => setCollapsed(!collapsed)}>
                    {collapsed ? <FaChevronRight /> : <FaBars />}
                </button>
                {!collapsed && <h3>Calendar</h3>}
            </div>

            {!collapsed && (
                <>
                    <div className="calendar-controls">
                        <button className="add-event-btn" onClick={handleAddEvent}>
                            <FaPlus /> Add Event
                        </button>
                    </div>

                    <div className="calendar-grid">
                        {/* TODO: Implement calendar grid */}
                        <div className="calendar-placeholder">
                            Calendar grid coming soon...
                        </div>
                    </div>

                    <div className="events-list">
                        <h4>Upcoming Events</h4>
                        {events.map(event => (
                            <div key={event.id} className={`event-item ${event.type}`}>
                                <div className="event-time">
                                    {event.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="event-title">{event.title}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <button className="calendar-hide-btn" onClick={() => setVisible(false)}>
                <FaChevronRight />
            </button>
        </aside>
    );
};

export default CalendarPanel; 