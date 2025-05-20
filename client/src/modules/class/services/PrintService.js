export const printClassList = (classes) => {
    const printContent = document.createElement('div');
    const currentDate = new Date().toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    printContent.innerHTML = `
        <html>
            <head>
                <title>Danh sách Lớp học</title>
                <meta charset="UTF-8">
                <style>
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                    body {
                        font-family: 'Times New Roman', Times, serif;
                        margin: 0;
                        padding: 20px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                    }
                    .title {
                        font-size: 24px;
                        font-weight: bold;
                        text-transform: uppercase;
                        margin: 20px 0;
                    }
                    .date {
                        text-align: right;
                        margin: 10px 0;
                        font-style: italic;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #000;
                        padding: 10px;
                        text-align: left;
                    }
                    th {
                        background-color: #f0f0f0;
                        font-weight: bold;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    .footer {
                        margin-top: 30px;
                        text-align: right;
                    }
                    .signature {
                        margin-top: 50px;
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="title">Danh sách Lớp học</div>
                    <div class="date">Ngày in: ${currentDate}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">STT</th>
                            <th style="width: 25%">Tên lớp</th>
                            <th style="width: 25%">Học kỳ</th>
                            <th style="width: 25%">Mã giáo viên</th>
                            <th style="width: 20%">Số học sinh</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${classes.map((classItem, index) => `
                            <tr>
                                <td style="text-align: center">${index + 1}</td>
                                <td>${classItem.className}</td>
                                <td>${classItem.semesterName || 'Chưa xác định'}</td>
                                <td>${classItem.teacherID}</td>
                                <td style="text-align: center">${classItem.studentCount || 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <div>Tổng số lớp: ${classes.length}</div>
                    <div class="signature">
                        <p>Người in báo cáo</p>
                        <p style="margin-top: 50px;">(Ký và ghi rõ họ tên)</p>
                    </div>
                </div>
            </body>
        </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();

    // Đợi cho nội dung được load hoàn tất trước khi in
    printWindow.onload = function() {
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 250);
    };
}; 