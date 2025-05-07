export const printStudentList = (classData, students, teacherDetails, semester) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        const printContent = `
            <html>
                <head>
                    <title>Class Student List</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        .header {
                            text-align: center;
                            margin-bottom: 20px;
                        }
                        .class-info {
                            margin-bottom: 20px;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                            text-align: left;
                        }
                        th {
                            background-color: #f5f5f5;
                        }
                        tr:nth-child(even) {
                            background-color: #f9f9f9;
                        }
                        .footer {
                            margin-top: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Class Student List</h1>
                    </div>
                    <div class="class-info">
                        <h2>${classData.className}</h2>
                        <p>Total Students: ${students.length}</p>
                        <p>Teacher: ${teacherDetails ? `${teacherDetails.firstName} ${teacherDetails.lastName}` : 'Not Assigned'}</p>
                        <p>Semester: ${semester ? semester.semesterName : 'Not Set'}</p>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Name</th>
                                <th>Gender</th>
                                <th>Date of Birth</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${students.map(student => `
                                <tr>
                                    <td>${student.studentID}</td>
                                    <td>${student.lastName} ${student.firstName}</td>
                                    <td>${student.gender}</td>
                                    <td>${student.dateOfBirth}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div class="footer">
                        <p>Generated on ${new Date().toLocaleString()}</p>
                    </div>
                </body>
            </html>
        `;
        printWindow.document.write(printContent);
        printWindow.document.close();
        printWindow.focus();
        // Wait for content to load before printing
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    }
}; 