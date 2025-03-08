import jsPDF from "jspdf";
import "jspdf-autotable";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const handleDownloadPDF = (data, filters) => {
  const doc = new jsPDF();

  const logoUrl = "/images/logo.png";
  doc.addImage(logoUrl, "PNG", 10, 10, 30, 10);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("APPOINTMENT REPORT", 80, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Intelligent Medical Diagnostic System", 80, 27);
    doc.text(
      "Generated on: " +
        new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }).format(new Date()),
      85,
      34
    );
  let reportTitle = "All appointments";

  if (filters.dateFrom && filters.dateTo) {
    reportTitle = `Appointments from ${filters.dateFrom} - ${filters.dateTo}`
  }
  if (filters.status && filters.status !== 'all') {
    reportTitle += ` | Status: ${filters.status}`;
  }
  if (filters.username) {
      reportTitle += ` | ${filters.username}`;
  }

  doc.setFontSize(15);
  doc.text(reportTitle, 14, 50);

  if (data.length === 0) {
    doc.text("No data available", 14, 35);
    doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
    return;
  }

  const tableColumn = ["Date","Appointment Time","Duration","Queue Number","Status","Patient","Doctor"]
  
    const tableRows = data.map((row) => [
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(row.date)),
      `${row.startTime} - ${row.endTime}` || "-",
      row.appointmentDuration || "-",
      row.queueNumber || "-",
      row.status || "-",
      row.patient?.username || "-",
      row.doctor?.username || "-",
    ]);
  
  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [0, 51, 153], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 10 },
  });

    doc.setFontSize(10);
    doc.text(
      "This report is system-generated.",
      14,
      doc.internal.pageSize.height - 30
    );
    doc.text(
      "For inquiries:nyagakristine@gmail.com",
      14,
      doc.internal.pageSize.height - 20
    );
    doc.text(
      "Page " + doc.internal.getNumberOfPages(),
      doc.internal.pageSize.width - 30,
      doc.internal.pageSize.height - 10
    );

  doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
};
