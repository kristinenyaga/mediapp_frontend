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
  doc.text("PATIENT REPORT", 85, 20);

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

  let reportTitle = "All Patients ";
  let fileName = "Patients";

  if (filters.search) {
    reportTitle += ` whose name contains ${filters.search}`
    fileName += `_name_contains_ ${filters.search}`;
    }
  if (filters.hasAppointments) {
    reportTitle += ` with appointments`;
    fileName += `_with_appointments`;
  }
  if (filters.startDate && filters.endDate) {
    reportTitle += ` registered from ${formatDate(filters.startDate)} to ${formatDate(
      filters.endDate
    )}`;
    fileName += `_registered_from ${formatDate(
      filters.startDate
    )} to ${formatDate(filters.endDate)}`;
  }
  if (filters.gender) {
    reportTitle += ` All ${filters.gender} patients`
    fileName += `All_${filters.gender}_patients`
  }

  doc.setFontSize(10);
  doc.setFont("helvetica");
  doc.text(reportTitle, 14, 50);

  // Table Headers
  const tableColumn = ["Name", "Email", "Phone", "Dob","Sex", "Appointments", "Registered"];
  const tableRows = data.map((row) => [
    row.username || "-",
    row.email || "-",
    row.phone || "-",
    row.dob || "-",
    row.gender || "-",
    row.appointments.length || "-",
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(row.createdAt)),
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
