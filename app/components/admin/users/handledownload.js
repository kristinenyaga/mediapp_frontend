import jsPDF from "jspdf";
import "jspdf-autotable";

export const handleDownloadPDF = (data, filters, userType, name) => {
  const doc = new jsPDF();
  console.log(data);

  let reportTitle = "Report";

  if (userType === "doctors") {
    reportTitle = "All Doctors";

    if (filters.specialization && filters.status && filters.experience) {
      reportTitle = `${filters.status} Doctors Specialized in ${filters.specialization} with at least ${filters.experience} years of experience`;
    } else if (filters.specialization && filters.experience) {
      reportTitle = `Doctors Specialized in ${filters.specialization} with at least ${filters.experience} years of experience`;
    } else if (filters.status && filters.experience) {
      reportTitle = `${filters.status} Doctors with at least ${filters.experience} years of experience`;
    } else if (filters.specialization && filters.status) {
      reportTitle = `${filters.status} Doctors Specialized in ${filters.specialization}`;
    } else if (filters.specialization) {
      reportTitle = `Doctors Specialized in ${filters.specialization}`;
    } else if (filters.status) {
      reportTitle = `${filters.status} Doctors`;
    } else if (filters.experience) {
      reportTitle = `Doctors with at least ${filters.experience} years of experience`;
    }
  } else if (userType === "appointment") {
    reportTitle = `${name}'s Appointments`;

    if (filters.status && filters.dateRange) {
      reportTitle = `${name}'s Appointments (${filters.status}) from ${filters.dateRange.start} to ${filters.dateRange.end}`;
    } else if (filters.status) {
      reportTitle = `${name}'s Appointments (${filters.status})`;
    } else if (filters.dateRange) {
      reportTitle = `${name}'s Appointments from ${filters.dateRange.start} to ${filters.dateRange.end}`;
    }
  }

  doc.setFontSize(18);
  doc.text(reportTitle, 14, 15);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 25);

  // Ensure there's data to display
  if (data.length === 0) {
    doc.text("No data available", 14, 35);
    doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
    return;
  }

  // Extract table columns dynamically
  const tableColumn = Object.keys(data[0]).filter((key) => key !== "id" || key !=='doctorId'); 
  // Format rows for table
  const tableRows = data.map((row) =>
    tableColumn.map((key) => {
      if (key === "patient" && typeof row.patient === "object") {
        return (
          row.patient.username ||
          `${row.patient.firstName} ${row.patient.lastName}`
        );
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
