import React, { useState, useEffect } from 'react';
import { FaPrint, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/TeacherTable.css';

const TeacherTable = () => {
    const [teachers, setTeachers] = useState([
        {
            id: 1,
            name: 'John Doe',
            subject: 'Art',
            email: 'john.doe@school.com',
            phone: '(555) 123-4567',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Jane Smith',
            subject: 'Music',
            email: 'jane.smith@school.com',
            phone: '(555) 234-5678',
            status: 'Active'
        }
    ]);

    const handlePrint = (teacher) => {
        const printContent = `
            Teacher Information:
            Name: ${teacher.name}
            Subject: ${teacher.subject}
            Email: ${teacher.email}
            Phone: ${teacher.phone}
            Status: ${teacher.status}
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Teacher Details - ${teacher.name}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h2 { color: #333; }
                        .info-row { margin: 10px 0; }
                        .label { font-weight: bold; }
                    </style>
                </head>
                <body>
                    <h2>Teacher Details</h2>
                    <div class="info-row"><span class="label">Name:</span> ${teacher.name}</div>
                    <div class="info-row"><span class="label">Subject:</span> ${teacher.subject}</div>
                    <div class="info-row"><span class="label">Email:</span> ${teacher.email}</div>
                    <div class="info-row"><span class="label">Phone:</span> ${teacher.phone}</div>
                    <div class="info-row"><span class="label">Status:</span> ${teacher.status}</div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const handleDetail = (teacher) => {
        // You can implement a modal or navigation to a detail page
        alert(`Viewing details for ${teacher.name}`);
    };

    const handleEdit = (teacher) => {
        // You can implement edit functionality here
        alert(`Editing ${teacher.name}`);
    };

    const handleDelete = (teacher) => {
        if (window.confirm(`Are you sure you want to delete ${teacher.name}?`)) {
            setTeachers(teachers.filter(t => t.id !== teacher.id));
        }
    };

    return (
        <div className="teacher-table-container">
            <div className="table-header">
                <h3>Teachers Directory</h3>
                <button className="add-teacher-btn">Add New Teacher</button>
            </div>
            <div className="table-wrapper">
                <table className="teacher-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Subject</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teachers.map(teacher => (
                            <tr key={teacher.id}>
                                <td>{teacher.name}</td>
                                <td>{teacher.subject}</td>
                                <td>{teacher.email}</td>
                                <td>{teacher.phone}</td>
                                <td>
                                    <span className={`status-badge ${teacher.status.toLowerCase()}`}>
                                        {teacher.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            className="action-btn print-btn"
                                            onClick={() => handlePrint(teacher)}
                                            title="Print"
                                        >
                                            <FaPrint />
                                        </button>
                                        <button
                                            className="action-btn detail-btn"
                                            onClick={() => handleDetail(teacher)}
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            className="action-btn edit-btn"
                                            onClick={() => handleEdit(teacher)}
                                            title="Edit"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            className="action-btn delete-btn"
                                            onClick={() => handleDelete(teacher)}
                                            title="Delete"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TeacherTable; 