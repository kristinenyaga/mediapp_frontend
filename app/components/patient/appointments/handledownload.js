import jsPDF from "jspdf";
import "jspdf-autotable";

export const handleDownloadPDF = (data, filters) => {
  const doc = new jsPDF();
  console.log(data);

  // Construct report title based on filters
  let reportTitle = "All Appointments";

  const { statusFilter, searchDoctor, sortOrder } = filters;

  if (statusFilter) {
    reportTitle = `Appointments - ${
      statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
    }`;
  }

  if (searchDoctor) {
    reportTitle += ` with Dr. ${searchDoctor}`;
  }

  if (sortOrder === "newest") {
    reportTitle += " (Newest First)";
  } else if (sortOrder === "oldest") {
    reportTitle += " (Oldest First)";
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
        return row.patient.username;
      }
      if (key === "searchDoctor" && typeof row.searchDoctor === "object") {
        return row.searchDoctor.username;
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
