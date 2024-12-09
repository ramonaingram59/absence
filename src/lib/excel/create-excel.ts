// Import library ExcelJS
import ExcelJS from 'exceljs'
import { formatTimeWIB } from '../utils';


export async function exportToExcel(data: any[]) {
  // Membuat workbook dan worksheet baru
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date()
  const worksheet = workbook.addWorksheet('Attendance');

  // Menambahkan header ke worksheet
  worksheet.columns = [
    { header: 'ID Absensi', key: 'id', width: 36 },
    { header: 'User ID', key: 'userId', width: 36 },
    { header: 'Name', key: 'name', width: 20 },
    { header: 'Email', key: 'email', width: 25 },
    { header: 'Role', key: 'role', width: 10 },
    { header: 'Position', key: 'position', width: 15 },
    { header: 'Department', key: 'departement', width: 15 },
    { header: 'Date', key: 'date', width: 15 },
    { header: 'In Time', key: 'inTime', width: 20 },
    { header: 'Out Time', key: 'outTime', width: 20 },
    { header: 'Status', key: 'status', width: 10 },
    { header: 'Created At', key: 'createdAt', width: 20 },
  ];

  // Menambahkan data ke worksheet
  data.forEach((record) => {
    worksheet.addRow({
      id: record.id,
      userId: record.userId,
      name: record.Users.name,
      email: record.Users.email,
      role: record.Users.role,
      position: record.Users.position || '-',
      departement: record.Users.departement,
      date: record.date,
      inTime: formatTimeWIB(record.inTime),
      outTime: formatTimeWIB(record.outTime) || '-',
      status: record.status,
      createdAt: record.createdAt,
    });
  });

  worksheet.views = [
    { state: 'frozen', ySplit: 1, activeCell: 'A1' }
  ];

  // Styling header
  worksheet.getRow(1).height = 30
  worksheet.getRow(1).eachCell((cell) => {
    cell.style = {
      font: { bold: true, color: { argb: "FFFFFF" } }, // Text putih
      alignment: { vertical: "middle", horizontal: "center" }, // Teks rata tengah
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "16A34A" }, // Warna latar biru
      },
    };
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Hindari header
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowNumber % 2 === 0 ? "F3F3F3" : "FFFFFF" }, // Warna berbeda untuk genap dan ganjil
        };
      });
    }
  });

  // Menyimpan workbook sebagai Blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Mengunduh file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Attendance.xlsx";
  link.click();

  // Membersihkan URL Blob
  URL.revokeObjectURL(link.href);
  console.log('File Excel berhasil disimpan sebagai Attendance.xlsx');
}



export async function exportUserToExcel(data: any[]) {
  // Membuat workbook dan worksheet baru
  const workbook = new ExcelJS.Workbook();
  workbook.created = new Date()
  const worksheet = workbook.addWorksheet('Users');
  // Menentukan kolom
  worksheet.columns = [
    { header: "ID", key: "id", width: 40 },
    { header: "Name", key: "name", width: 25 },
    { header: "Departement", key: "departement", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "Created At", key: "createdAt", width: 25 },
    { header: "Position", key: "position", width: 15 },
    { header: "NIK", key: "NIK", width: 15 },
    { header: "Status", key: "status", width: 15 }
  ];

  // Menambahkan data baris berdasarkan array objek
  data.forEach((record) => {
    worksheet.addRow({
      id: record.id,
      name: record.name,
      departement: record.departement,
      email: record.email,
      createdAt: record.createdAt,
      position: record.position || "-", // Default jika null
      NIK: record.NIK || "-", // Default jika null
      status: record.status || "-" // Default jika null
    });
  });

  worksheet.views = [
    { state: 'frozen', ySplit: 1, activeCell: 'A1' }
  ];

  // Styling header
  worksheet.getRow(1).height = 30
  worksheet.getRow(1).eachCell((cell) => {
    cell.style = {
      font: { bold: true, color: { argb: "FFFFFF" } }, // Text putih
      alignment: { vertical: "middle", horizontal: "center" }, // Teks rata tengah
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "16A34A" }, // Warna latar biru
      },
    };
  });

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) { // Hindari header
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: rowNumber % 2 === 0 ? "F3F3F3" : "FFFFFF" }, // Warna berbeda untuk genap dan ganjil
        };
      });
    }
  });

  // Menyimpan workbook sebagai Blob
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

  // Mengunduh file
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Users.xlsx";
  link.click();

  // Membersihkan URL Blob
  URL.revokeObjectURL(link.href);
  console.log('File Excel berhasil disimpan sebagai Users.xlsx');
}
