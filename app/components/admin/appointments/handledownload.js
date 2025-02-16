import jsPDF from "jspdf";
import "jspdf-autotable";

export const handleDownloadPDF = (data, filters) => {
  const doc = new jsPDF();
  console.log(data);

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
  doc.text(reportTitle, 14, 15);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 25);

  if (data.length === 0) {
    doc.text("No data available", 14, 35);
    doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
    return;
  }

  const tableColumn = Object.keys(data[0]).filter(
    (key) => key !== "id" && key !== "doctorId" && key !== "patientId"
  ); 
  
  const tableRows = data.map((row) =>
    tableColumn.map((key) => {
      if (key === "patient" && typeof row.patient === "object") {
        return row.patient.username
      }
      if (key === "doctor" && typeof row.doctor === "object") {
        return row.doctor.username;
      }
      if (key === "date") {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }).format(new Date(row.date));
        
      }
      return row[key] || "-";
    })
  );

  doc.autoTable({
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [41, 128, 185] },
  });

  doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
};
