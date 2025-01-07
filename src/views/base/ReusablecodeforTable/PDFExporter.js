import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PDFExporter = ({ title, columns, data, fileName }) => {
  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a3');  // A3 size in landscape for more space

    const columnHeaders = columns.map((col) => col.Header);
    const rows = data.map((item) => {
      return columns.map((col) => item[col.accessor] || '--');
    });

    // Title
    doc.setFontSize(20);
    doc.text(title, doc.internal.pageSize.width / 2, 15, { align: 'center' });

    // Auto-scaling for columns
    const calculateColumnWidth = () => {
      const pageWidth = doc.internal.pageSize.width - 20;
      return Math.floor(pageWidth / columnHeaders.length);
    };

    const columnWidth = calculateColumnWidth();

    doc.autoTable({
      head: [columnHeaders],
      body: rows,
      startY: 30,
      theme: 'striped',
      headStyles: {
        fillColor: [23, 54, 93],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 8,
        cellPadding: 2,
      },
      styles: {
        overflow: 'linebreak',
        cellWidth: 'wrap',
      },
      columnStyles: {
        0: { cellWidth: columnWidth },
      },
      margin: { top: 40, left: 10, right: 10 },
    });

    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10);
    }

    doc.save(fileName || 'report.pdf');
  };

  return exportToPDF;  // Return the function directly
};

export default PDFExporter;
