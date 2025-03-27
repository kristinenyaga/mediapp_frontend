import jsPDF from "jspdf";
import "jspdf-autotable";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};
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
export const calculateAge = (dobString) => {
  const dob = new Date(dobString);
  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  const dayDiff = today.getDate() - dob.getDate();

  // Adjust age if the birthday has not occurred yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age;
};
export const handleDownloadPDF = (data,user, filters,profile) => {
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
let reportDateRange = "From Dec 2024 - March 2025";

// Check if dateRange is defined and has valid startDate & endDate
if (
  filters.dateRange &&
  filters.dateRange.length > 0 &&
  filters.dateRange[0].startDate &&
  filters.dateRange[0].endDate
) {
  const startDate = new Date(filters.dateRange[0].startDate);
  const endDate = new Date(filters.dateRange[0].endDate);

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

  if (sortOrder === "latest") {
    reportTitle += " (Latest First)";
  } else if (sortOrder === "oldest") {
    reportTitle += " (Oldest First)";
  }

  doc.setFontSize(10);
  doc.setFont("helvetica");
  doc.text(reportTitle, 14, 85);

  doc.setFontSize(13);
  doc.setFont("helvetica", "medium");
  doc.text("Patient Information", 14, 60);

  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text("Name", 14, 68);

    doc.setFontSize(11);
    doc.setFont("helvetica", "light");
    doc.text(`${user.username}`, 30, 68);

  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text("Age", 14, 75);

    doc.setFontSize(11);
    doc.setFont("helvetica", "light");
    doc.text(`${calculateAge(profile?.dob)}`, 30, 75);
  

  if (data.length === 0) {
    doc.text("No data available", 14, 85);
    doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
    return;
  }

  const tableColumn = ["S/N","Date", "Appointment time", "Appointment Duration", "Status", "Doctor"]
  
  const tableRows = data.map((row, index) => [
    index+1,
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(row.date)),
    `${formatTime(row.startTime)}-${formatTime(row.endTime)}` || "-",
    row.appointmentDuration || "-",
    row.status || "-",
    row.doctor.username || "-",
  ]);

  doc.autoTable({
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    styles: { fontSize: 9 },
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

  doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
};
