import ExcelJS from 'exceljs';

const ExcelExporter = ({ columns, data, fileName = 'company.xlsx' }) => {
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Group Data');

    // Step 1: Prepare column headers with styling
    worksheet.columns = [
      { header: 'SN', key: 'SN', width: 15 },
      ...columns.map(col => ({
        header: col.Header || col.accessor,
        key: col.accessor,
        width: 20
      }))
    ];

    // Style header cells
    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.font = {
        bold: true,
        size: 14,
        color: { argb: 'FFFFFFFF' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '1D3D5F' }
      };
      cell.alignment = {
        horizontal: 'center',
        vertical: 'middle',
        wrapText: true
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    // Dynamically adjust header height
    const maxHeaderLength = Math.max(...columns.map(col => (col.Header || col.accessor).length));
    headerRow.height = Math.max(25, maxHeaderLength * 3);

    // Step 3: Add data with row height adjustment
    data.forEach((item, rowIndex) => {
      const row = { SN: rowIndex + 1 };
      columns.forEach(col => {
        row[col.accessor] = item[col.accessor] || 'N/A';
      });

      const addedRow = worksheet.addRow(row);

      // Apply styling to each row
      addedRow.eachCell((cell) => {
        cell.alignment = {
          horizontal: 'center',
          vertical: 'middle',
          wrapText: true
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });

      // Adjust row height dynamically
      const maxCellLength = Math.max(...Object.values(row).map(value => `${value}`.length));
      addedRow.height = Math.max(25, maxCellLength * 1.7);
    });

    // Step 4: Trigger download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  };

  return exportToExcel;  // Return the function directly
};

export default ExcelExporter;


// import ExcelJS from 'exceljs';

// const ExcelExporter = ({ columns, data, fileName = 'company.xlsx', mytitle }) => {
//   const exportToExcel = async () => {
    
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet('Group Data');

//     // Step 1: Add title to the first row
//     const titleRow = worksheet.addRow([mytitle]);
//     titleRow.font = {
//       bold: true,
//       size: 16,
//     };
//     titleRow.alignment = {
//       horizontal: 'center',
//       vertical: 'middle',
//     };
//     titleRow.height = 25;
//     worksheet.mergeCells(`A1:${String.fromCharCode(65 + columns.length)}1`); // Merge cells for the title

//     // Step 2: Prepare column headers with styling
//     worksheet.columns = [
//       { header: 'SN', key: 'SN', width: 15 },
//       ...columns.map(col => ({
//         header: col.Header || col.accessor,
//         key: col.accessor,
//         width: 20
//       }))
//     ];

//     // Style header cells
//     const headerRow = worksheet.getRow(2);  // Set header to row 2, so it comes after the title row
//     headerRow.eachCell((cell) => {
//       cell.font = {
//         bold: true,
//         size: 14,
//         color: { argb: 'FFFFFFFF' }
//       };
//       cell.fill = {
//         type: 'pattern',
//         pattern: 'solid',
//         fgColor: { argb: '1D3D5F' }
//       };
//       cell.alignment = {
//         horizontal: 'center',
//         vertical: 'middle',
//         wrapText: true
//       };
//       cell.border = {
//         top: { style: 'thin' },
//         bottom: { style: 'thin' },
//         left: { style: 'thin' },
//         right: { style: 'thin' }
//       };
//     });

//     // Dynamically adjust header height
//     const maxHeaderLength = Math.max(...columns.map(col => (col.Header || col.accessor).length));
//     headerRow.height = Math.max(25, maxHeaderLength * 3);

//     // Step 3: Add data with row height adjustment
//     data.forEach((item, rowIndex) => {
//       const row = { SN: rowIndex + 1 };
//       columns.forEach(col => {
//         row[col.accessor] = item[col.accessor] || 'N/A';
//       });

//       const addedRow = worksheet.addRow(row);

//       // Apply styling to each row
//       addedRow.eachCell((cell) => {
//         cell.alignment = {
//           horizontal: 'center',
//           vertical: 'middle',
//           wrapText: true
//         };
//         cell.border = {
//           top: { style: 'thin' },
//           bottom: { style: 'thin' },
//           left: { style: 'thin' },
//           right: { style: 'thin' }
//         };
//       });

//       // Adjust row height dynamically
//       const maxCellLength = Math.max(...Object.values(row).map(value => `${value}`.length));
//       addedRow.height = Math.max(25, maxCellLength * 1.7);
//     });

//     // Step 4: Trigger download
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//     const link = document.createElement('a');
//     link.href = URL.createObjectURL(blob);
//     link.download = fileName;
//     link.click();
//   };

//   return exportToExcel;  // Return the function directly
// };

// export default ExcelExporter;
