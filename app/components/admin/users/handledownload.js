import jsPDF from "jspdf";
import "jspdf-autotable";

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
};

export const handleDownloadPDF = (data, filters, userType) => {
  const doc = new jsPDF();

  // Add the system logo
  const logoUrl = "/images/logo.png";
  doc.addImage(logoUrl, "PNG", 10, 10, 30, 10);

  // Report Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("SYSTEM USERS REPORT", 80, 20);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Intelligent Medical Diagnostic System", 80, 27);
  doc.text("Generated on: " + formatDate(new Date()), 85, 34);

  let reportTitle = "Report";
  let filename = "report.pdf";
  let tableColumns = [];
  let tableRows = [];

  // 🩺 **DOCTOR REPORT LOGIC**
  if (userType === "doctor") {
    reportTitle = "All Doctors";
    if (filters.specialization && filters.status && filters.experience) {
      reportTitle = `${filters.status} Doctors in ${filters.specialization} with at least ${filters.experience} years`;
    } else if (filters.specialization && filters.experience) {
      reportTitle = `Doctors in ${filters.specialization} with ${filters.experience}+ years`;
    } else if (filters.status && filters.experience) {
      reportTitle = `${filters.status} Doctors with ${filters.experience}+ years`;
    } else if (filters.specialization && filters.status) {
      reportTitle = `${filters.status} Doctors in ${filters.specialization}`;
    } else if (filters.specialization) {
      reportTitle = `Doctors in ${filters.specialization}`;
    } else if (filters.status) {
      reportTitle = `${filters.status} Doctors`;
    } else if (filters.experience) {
      reportTitle = `Doctors with ${filters.experience}+ years of experience`;
    }

    filename = `${reportTitle.replace(/\s+/g, "_")}.pdf`;

    // Doctor table columns
    tableColumns = [
      "Name",
      "Email",
      "Phone",
      "Specialization",
      "Experience (Years)",
      "Room",
      "Status",
      "Appointments",
    ];

    // Map doctor data to table rows
    tableRows = data.map((doctor) => [
      doctor.username || "-",
      doctor.email || "-",
      doctor.phone || "-",
      doctor.specialization || "-",
      doctor.yearsOfExperience || "-",
      doctor.room_number || "-",
      doctor.status || "-",
      doctor.appointments.length || 0, // Ensure this is a number
    ]);
  }

  // 🏥 **PATIENT REPORT LOGIC**
  else if (userType === "patient") {
    reportTitle = "List Of All Patients";
    if (filters.status && filters.gender) {
      reportTitle = `${filters.status} ${filters.gender} Patients`;
    } else if (filters.status) {
      reportTitle = `${filters.status} Patients`;
    } else if (filters.gender) {
      reportTitle = `Patients - ${filters.gender}`;
    }

    filename = `${reportTitle.replace(/\s+/g, "_")}.pdf`;

    // Patient table columns
    tableColumns = ["Name", "Email", "Phone", "Appointments", "Gender","Date Registered"];

    // Map patient data to table rows
    tableRows = data.map((patient) => [
      patient.username || "-",
      patient.email || "-",
      patient.phone || "-",
      patient.appointments.length || "-",
      patient.gender || "-",
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(patient.createdAt)),
    ]);
  }

  // Check if there's any data to display
  if (data.length === 0) {
    doc.text("No data available", 14, 50);
    doc.save(filename);
    return;
  }

  // Add Report Title
  doc.setFontSize(10);
  doc.setFont("helvetica");
  doc.text(reportTitle, 14, 50);

  // Generate the Table
  doc.autoTable({
    startY: 55,
    head: [tableColumns],
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
    "For inquiries: nyagakristine@gmail.com",
    14,
    doc.internal.pageSize.height - 20
  );
  doc.text(
    "Page " + doc.internal.getNumberOfPages(),
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  );

  // Save the PDF
  doc.save(filename);
};
