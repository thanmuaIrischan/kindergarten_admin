export const printSemesterList = (semesters) => {
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
                <title>Danh sách Học kỳ</title>
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
                    <div class="title">Danh sách Học kỳ</div>
                    <div class="date">Ngày in: ${currentDate}</div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th style="width: 5%">STT</th>
                            <th style="width: 30%">Tên học kỳ</th>
                            <th style="width: 20%">Ngày bắt đầu</th>
                            <th style="width: 20%">Ngày kết thúc</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${semesters.map((semester, index) => {
                            const startDate = semester.startDate ? new Date(semester.startDate).toLocaleDateString('vi-VN') : '';
                            const endDate = semester.endDate ? new Date(semester.endDate).toLocaleDateString('vi-VN') : '';
                            return `
                                <tr>
                                    <td style="text-align: center">${index + 1}</td>
                                    <td>${semester.semesterName || ''}</td>
                                    <td>${startDate}</td>
                                    <td>${endDate}</td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
                <div class="footer">
                    <div>Tổng số học kỳ: ${semesters.length}</div>
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