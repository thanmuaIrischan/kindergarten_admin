/**
 * Utility functions for printing student data
 */

/**
 * Generates the print content HTML for the student list
 * @param {Array} students - Array of student objects
 * @returns {string} HTML content for printing
 */
export const generatePrintContent = (students) => {
    try {
        if (!Array.isArray(students)) {
            throw new Error('Students must be an array');
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Student List</title>
                <style>
                    @page {
                        size: landscape;
                        margin: 1cm;
                    }
                    body {
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 20px;
                        font-size: 12px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 20px;
                    }
                    .header h1 {
                        margin: 0;
                        color: #333;
                        font-size: 24px;
                    }
                    .header p {
                        margin: 5px 0;
                        color: #666;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        font-size: 11px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                        vertical-align: top;
                    }
                    th {
                        background-color: #f5f5f5;
                        font-weight: bold;
                        white-space: nowrap;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    td {
                        max-width: 150px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }
                    .print-button {
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        padding: 10px 20px;
                        background-color: #4CAF50;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 14px;
                    }
                    .print-button:hover {
                        background-color: #45a049;
                    }
                    @media print {
                        .print-button {
                            display: none;
                        }
                        body {
                            margin: 0;
                            padding: 15px;
                        }
                        table {
                            page-break-inside: auto;
                        }
                        tr {
                            page-break-inside: avoid;
                            page-break-after: auto;
                        }
                        thead {
                            display: table-header-group;
                        }
                        tfoot {
                            display: table-footer-group;
                        }
                    }
                </style>
            </head>
            <body>
                <button class="print-button" onclick="window.print()">Print List</button>
                <div class="header">
                    <h1>Student List</h1>
                    <p>Generated on: ${new Date().toLocaleString()}</p>
                    <p>Total Students: ${students.length}</p>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 40px;">No.</th>
                            <th style="width: 100px;">Student ID</th>
                            <th style="width: 150px;">Name</th>
                            <th style="width: 80px;">Date of Birth</th>
                            <th style="width: 60px;">Gender</th>
                            <th style="width: 60px;">Grade</th>
                            <th style="width: 120px;">School</th>
                            <th style="width: 100px;">Class</th>
                            <th style="width: 100px;">Education System</th>
                            <th style="width: 120px;">Father's Name</th>
                            <th style="width: 100px;">Father's Occupation</th>
                            <th style="width: 120px;">Mother's Name</th>
                            <th style="width: 100px;">Mother's Occupation</th>
                            <th style="width: 100px;">Image</th>
                            <th style="width: 100px;">Birth Certificate</th>
                            <th style="width: 100px;">Household Registration</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${students.map(student => `
                            <tr>
                                <td>${student.no}</td>
                                <td>${student.id || ''}</td>
                                <td>${student.name || ''}</td>
                                <td>${student.dateOfBirth || ''}</td>
                                <td>${student.gender || ''}</td>
                                <td>${student.gradeLevel || ''}</td>
                                <td>${student.school || ''}</td>
                                <td>${student.class || ''}</td>
                                <td>${student.educationSystem || ''}</td>
                                <td>${student.fatherName || ''}</td>
                                <td>${student.fatherOccupation || ''}</td>
                                <td>${student.motherName || ''}</td>
                                <td>${student.motherOccupation || ''}</td>
                                <td>${student.image || ''}</td>
                                <td>${student.birthCertificate || ''}</td>
                                <td>${student.householdRegistration || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </body>
            </html>
        `;
    } catch (error) {
        console.error('Error generating print content:', error);
        throw new Error('Failed to generate print content: ' + error.message);
    }
};

/**
 * Maps student data to the format needed for printing
 * @param {Array} filteredStudents - Array of student objects to be printed
 * @returns {Array} Mapped student data ready for printing
 */
export const mapStudentsForPrint = (filteredStudents) => {
    try {
        if (!Array.isArray(filteredStudents)) {
            throw new Error('Filtered students must be an array');
        }

        console.log('Mapping students for print:', filteredStudents);

        return filteredStudents.map((student, index) => {
            try {
                console.log('Processing student:', student);
                
                const mappedStudent = {
                    no: index + 1,
                    id: student.studentID || '',
                    name: student.firstName && student.lastName 
                        ? `${student.lastName} ${student.firstName}`.trim()
                        : student.name || '',
                    dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '',
                    gender: student.gender || '',
                    gradeLevel: student.gradeLevel || '',
                    school: student.school || '',
                    educationSystem: student.educationSystem || '',
                    fatherName: student.parentName || student.fatherFullname || '',
                    fatherOccupation: student.fatherOccupation || '',
                    motherName: student.motherName || student.motherFullname || '',
                    motherOccupation: student.motherOccupation || '',
                    class: student.class || '',
                    image: student.studentDocument?.image || '',
                    birthCertificate: student.studentDocument?.birthCertificate || '',
                    householdRegistration: student.studentDocument?.householdRegistration || ''
                };

                console.log('Mapped student:', mappedStudent);
                return mappedStudent;
            } catch (studentError) {
                console.error('Error mapping student:', studentError);
                return null;
            }
        }).filter(Boolean); // Remove any null entries from failed mappings
    } catch (error) {
        console.error('Error in mapStudentsForPrint:', error);
        throw new Error('Failed to map students for print: ' + error.message);
    }
};

/**
 * Handles the print functionality for the student list
 * @param {Array} filteredStudents - Array of student objects to be printed
 */
export const handlePrint = (filteredStudents) => {
    try {
        console.log('Starting print process with students:', filteredStudents);

        if (!Array.isArray(filteredStudents)) {
            throw new Error('Filtered students must be an array');
        }

        if (filteredStudents.length === 0) {
            throw new Error('No students to print');
        }

        // Create a new window
        const printWindow = window.open('', '_blank', 'width=800,height=600');
        if (!printWindow) {
            throw new Error('Failed to open print window. Please allow popups for this website.');
        }

        // Map the students data
        console.log('Mapping students data...');
        const students = mapStudentsForPrint(filteredStudents);
        console.log('Mapped students:', students);

        if (!students || students.length === 0) {
            throw new Error('No valid student data to print');
        }

        // Generate and write the print content
        console.log('Generating print content...');
        const printContent = generatePrintContent(students);
        console.log('Print content generated');

        // Write the content to the new window
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Focus the window
        printWindow.focus();

        console.log('Print process completed successfully');
    } catch (error) {
        console.error('Error in handlePrint:', error);
        alert('Failed to print student list: ' + error.message);
    }
}; 