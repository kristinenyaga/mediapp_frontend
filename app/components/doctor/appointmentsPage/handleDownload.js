import jsPDF from "jspdf";
import "jspdf-autotable";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
export const formatTime = (timestring) => {
  if (!timestring) return "N/A";
  const [hours, minutes] = timestring.split(":");
  const date = new Date();
  date.setHours(hours, minutes, 0);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const handleDownloadPDF = (data, filters,user) => {
  const doc = new jsPDF();
  const logoUrl = "/images/logo.png";
  doc.addImage(logoUrl, "PNG", 90, 10, 30, 10);
  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text("Intelligent medical Diagnostic System", 80, 24);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("APPOINTMENT REPORT", 80, 35);

  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text(
    "Generated on: " +
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    85,
    50
  );
let reportDateRange = `From ${formatDate(
  new Date().toISOString().split("T")[0]
)} - ${formatDate(new Date().toISOString().split("T")[0])}`;

// Check if dateRange is defined and has valid startDate & endDate
if (
  filters.startDate &&
  filters.endDate
) {
  const startDate = new Date(filters.startDate);
  const endDate = new Date(filters.endDate);

  // Format the dates properly
  const formattedStartDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(startDate);

  const formattedEndDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(endDate);

  reportDateRange = `From ${formattedStartDate} - ${formattedEndDate}`;
}

doc.setFontSize(11);
doc.setFont("helvetica");
doc.text(reportDateRange, 80, 41);

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

  doc.setFontSize(13);
  doc.setFont("helvetica");
  doc.text("Doctor Information", 15, 68);
  doc.setFontSize(10);
  doc.setFont("helvetica");
  doc.text("Name", 15, 75);
  doc.setFontSize(10);
  doc.text(`${user.username}`, 35, 75);
  doc.setFontSize(10);
  doc.setFont("helvetica");
  doc.text("Email", 15, 80);
  doc.setFontSize(10);
  doc.text(`${user.email}`, 35, 80);

  doc.setFontSize(13);
  doc.setFont("helvetica");
  doc.text(reportTitle, 15, 100);

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
    `${formatTime(row.startTime)} - ${formatTime(row.endTime)}` || "-",
    row.status || "-",
    row.patient?.gender || "-",
  ]);

  // Table
  doc.autoTable({
    startY: 105,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
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
