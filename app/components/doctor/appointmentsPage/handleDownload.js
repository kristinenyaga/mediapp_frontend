import jsPDF from "jspdf";
import "jspdf-autotable";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export const handleDownloadPDF = (data, filters) => {
  const doc = new jsPDF();

  const logoUrl = "/images/logo.png";
  doc.addImage(logoUrl, "PNG", 10,10,30,10);

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

  let reportTitle = "All Appointments ";
  let fileName = "Appointments_";

  if (filters.status) {
    reportTitle += ` ${filters.status}`
    fileName += ` ${filters.status}`;
    }
  if (filters.patientName) {
    reportTitle += `for ${filters.patientName}`;
    fileName += `Appointments_${filters.patientName}`;
  }
  if (filters.doctorName) {
    reportTitle += ` | Doctor: ${filters.doctorName}`;
    fileName += `_Doctor_${filters.doctorName}`;
  }

  if (filters.startDate && filters.endDate) {
    reportTitle += ` from ${formatDate(filters.startDate)} to ${formatDate(
      filters.endDate
    )}`;
    fileName += `_from ${formatDate(filters.startDate)} to ${formatDate(
      filters.endDate
    )}`;
  }
  if (filters.sex) {
    reportTitle += ` for ${filters.sex} patients`
    fileName += ` for ${filters.sex} patients`
  }

  doc.setFontSize(10);
  doc.setFont("helvetica");
  doc.text(reportTitle, 14, 50);

  // Table Headers
  const tableColumn = ["Date", "Doctor", "Patient", "Appointment Time", "Status", "Gender"];
  const tableRows = data.map((row) => [
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(row.date)),
    row.doctor?.username || "-",
    row.patient?.username || "-",
    `${row.startTime} - ${row.endTime}` || "-",
    row.status || "-",
    row.patient?.gender || "-",
  ]);

  // Table
  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 7 },
    headStyles: { fillColor: [0, 51, 153], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 10 },
  });

  // Footer
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

  doc.save(`${fileName.replace(/\s+/g, "_")}.pdf`);
};
