import React from 'react';
import '../../styles/Dashboard.css';

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h2>Welcome to the Kindergarten Admin Dashboard</h2>
            <p>Select a section from the navigation to get started.</p>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Quick Stats</h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">42</span>
                            <span className="stat-label">Total Students</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">8</span>
                            <span className="stat-label">Active Classes</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">12</span>
                            <span className="stat-label">Staff Members</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">5</span>
                            <span className="stat-label">Custom Modules</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>Recent Activity</h3>
                    <ul className="activity-list">
                        <li>New student registration: Emma Thompson</li>
                        <li>Class schedule updated: Butterfly Room</li>
                        <li>Staff meeting scheduled for next week</li>
                        <li>New module added: Attendance Tracker</li>
                    </ul>
                </div>

                <div className="dashboard-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <button>Add New Student</button>
                        <button>Create Class</button>
                        <button>Schedule Event</button>
                        <button>Generate Report</button>
                    </div>
                </div>

                <div className="dashboard-card">
                    <h3>System Status</h3>
                    <div className="status-list">
                        <div className="status-item">
                            <span className="status-label">Database</span>
                            <span className="status-value online">Online</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">API Services</span>
                            <span className="status-value online">Online</span>
                        </div>
                        <div className="status-item">
                            <span className="status-label">Storage</span>
                            <span className="status-value warning">80% Used</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 