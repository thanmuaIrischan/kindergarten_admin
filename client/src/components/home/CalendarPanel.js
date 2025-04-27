import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaChevronLeft, FaCalendarAlt, FaClock } from 'react-icons/fa';
import '../../styles/CalendarPanel.css';

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const demoEvents = [
    { day: 8, color: 'blue', title: 'Life Contingency Tutorials', date: '8th - 10th July 2021', time: '8AM - 9AM', location: 'Edulog Tutorial College, BLK 56, Lagos State.', type: 'tutorial' },
    { day: 13, color: 'pink', title: 'Social Insurance Test', date: '13th July 2021', time: '8AM - 9AM', location: 'School Hall, University Road, Lagos State.', type: 'test' },
    { day: 18, color: 'green', title: 'Adv. Maths Assignment Due', date: '18th July 2021', time: '', location: '**To be submitted via Email', type: 'assignment' },
    { day: 23, color: 'orange', title: `Dr. Dipo's Tutorial Class`, date: '23rd July 2021', time: '10AM - 1PM', location: 'Edulog Tutorial College, BLK 56, Lagos State.', type: 'class' },
];

function getTimeString() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getMonthDays(year, month) {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    // Adjust: Sunday (0) -> 6, Monday (1) -> 0
    const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1);
    const days = [];
    for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
}

const CalendarPanel = ({ collapsed, setCollapsed, visible, setVisible }) => {
    const [time, setTime] = useState(getTimeString());
    const [year, setYear] = useState(2021);
    const [month, setMonth] = useState(6); // July (0-based)

    useEffect(() => {
        const interval = setInterval(() => setTime(getTimeString()), 1000);
        return () => clearInterval(interval);
    }, []);

    const days = getMonthDays(year, month);
    // Map day number to color for dots
    const markedDays = Object.fromEntries(demoEvents.map(e => [e.day, e.color]));
    const eventMap = Object.fromEntries(demoEvents.map(e => [e.day, e]));

    if (!visible) {
        return (
            <button className="calendar-show-btn" onClick={() => setVisible(true)}>
                <FaChevronLeft />
            </button>
        );
    }

    if (collapsed) {
        return (
            <div className="calendar-panel-collapsed">
                <button className="calendar-collapse-btn" onClick={() => setCollapsed(false)}>
                    <FaChevronLeft />
                </button>
            </div>
        );
    }

    return (
        <aside className="calendar-panel calendar-elegant">
            <div className="calendar-panel-header">
                <button className="calendar-collapse-btn" onClick={() => setCollapsed(true)}>
                    <FaChevronRight />
                </button>
                <span>My Progress</span>
                <div className="calendar-month-dropdown">
                    <select value={month} onChange={e => setMonth(Number(e.target.value))}>
                        {MONTHS.map((m, i) => <option value={i} key={m}>{m} {year}</option>)}
                    </select>
                </div>
            </div>
            <div className="calendar-elegant-frame">
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
                        <div className="calendar-event-date-circle" style={{ background: `var(--event-${ev.color})` }}>{ev.day}</div>
                        <div className="calendar-event-info">
                            <div className="calendar-event-title">{ev.title}</div>
                            <div className="calendar-event-meta">{ev.date} {ev.time && <>• {ev.time}</>}</div>
                            <div className="calendar-event-location">{ev.location}</div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="calendar-hide-btn" onClick={() => setVisible(false)} title="Hide Calendar">
                Hide
            </button>
        </aside>
    );
};

export default CalendarPanel; 