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
  doc.addImage(logoUrl, "PNG", 90, 10, 30, 10);
  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text("Intelligent medical Diagnostic System", 78, 24);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENTS REPORT", 83, 35);

  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text(
    "Generated on: " +
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    83,
    48
  );

let reportDateRange = "From Dec 2024 - March 2025";

    doc.setFontSize(11);
    doc.setFont("helvetica");
    doc.text(reportDateRange, 80, 41);
  

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

  doc.setFontSize(12);
  doc.setFont("helvetica");
  doc.text(reportTitle, 14, 65);

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
    startY: 70,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: { fillColor: [0, 51, 153], textColor: 255 },
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
