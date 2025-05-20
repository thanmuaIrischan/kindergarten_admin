export const printTeacherList = (teachers) => {
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
                <title>Danh sách Giáo viên</title>
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
                    <div class="title">Danh sách Giáo viên</div>
                    <div class="date">Ngày in: ${currentDate}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">STT</th>
                            <th style="width: 15%">Mã GV</th>
                            <th style="width: 20%">Họ</th>
                            <th style="width: 15%">Tên</th>
                            <th style="width: 15%">Số điện thoại</th>
                            <th style="width: 30%">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teachers.map((teacher, index) => `
                            <tr>
                                <td style="text-align: center">${index + 1}</td>
                                <td>${teacher.teacherID || ''}</td>
                                <td>${teacher.lastName || ''}</td>
                                <td>${teacher.firstName || ''}</td>
                                <td>${teacher.phone || ''}</td>
                                <td>${teacher.email || ''}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <div>Tổng số giáo viên: ${teachers.length}</div>
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