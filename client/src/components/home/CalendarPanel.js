import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaClock } from 'react-icons/fa';
import '../../styles/CalendarPanel.css';

const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getTimeString = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

const getMonthDays = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result = Array(firstDay).fill(0);
    for (let i = 1; i <= daysInMonth; i++) result.push(i);
    return result;
};

const demoEvents = [
    { day: 15, title: 'Parent Meeting', date: 'July 15', time: '2:00 PM', location: 'Room 101', color: 'blue' },
    { day: 18, title: 'Art Exhibition', date: 'July 18', time: '3:30 PM', location: 'Main Hall', color: 'pink' },
    { day: 22, title: 'Sports Day', date: 'July 22', time: '9:00 AM', location: 'Playground', color: 'green' }
];

const CalendarPanel = ({ collapsed, toggleCollapse, toggleVisibility }) => {
    const [time, setTime] = useState(getTimeString());
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());

    useEffect(() => {
        const interval = setInterval(() => setTime(getTimeString()), 1000);
        return () => clearInterval(interval);
    }, []);

    const days = getMonthDays(year, month);
    const markedDays = Object.fromEntries(demoEvents.map(e => [e.day, e.color]));

    if (collapsed) {
        return (
            <div className="calendar-panel-collapsed">
                <button className="calendar-collapse-btn" onClick={toggleCollapse}>
                    <FaChevronLeft />
                </button>
            </div>
        );
    }

    return (
        <div className="calendar-panel">
            <div className="calendar-panel-header">
                <button className="calendar-collapse-btn" onClick={toggleCollapse}>
                    <FaChevronRight />
                </button>
                <span>Calendar</span>
                <div className="calendar-month-dropdown">
                    <select value={month} onChange={e => setMonth(Number(e.target.value))}>
                        {MONTHS.map((m, i) => <option value={i} key={m}>{m} {year}</option>)}
                    </select>
                </div>
            </div>
            <div className="calendar-panel-content">
                <div className="calendar-grid">
                    <div className="calendar-header">
                        {WEEKDAYS.map(d => <span key={d}>{d}</span>)}
                    </div>
                    <div className="calendar-body">
                        {days.map((d, i) => d ? (
                            <div className="day" key={i}>
                                <span className="day-number">{d}</span>
                                {markedDays[d] && <span className={`dot ${markedDays[d]}`}></span>}
                            </div>
                        ) : <div className="day empty" key={i}></div>)}
                    </div>
                </div>
                <div className="calendar-clock"><FaClock /> {time}</div>
                <div className="calendar-events-header">
                    <span>Upcoming Activities</span>
                    <a href="#" className="calendar-see-all">See all</a>
                </div>
                <div className="calendar-events-list">
                    {demoEvents.map(ev => (
                        <div className={`calendar-event-card ${ev.color}`} key={ev.day}>
                            <div className="calendar-event-date-circle">{ev.day}</div>
                            <div className="calendar-event-info">
                                <div className="calendar-event-title">{ev.title}</div>
                                <div className="calendar-event-meta">{ev.date} {ev.time && <>• {ev.time}</>}</div>
                                <div className="calendar-event-location">{ev.location}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <button className="calendar-hide-btn" onClick={toggleVisibility}>
                Hide Calendar
            </button>
        </div>
    );
};

export default CalendarPanel; 