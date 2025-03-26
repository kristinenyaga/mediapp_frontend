import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

export const generateFeedbackReport = (filteredFeedback, filter) => {
  const doc = new jsPDF();
  const logoUrl = "/images/logo.png";
  doc.addImage(logoUrl, "PNG", 90, 10, 30, 10);
  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text("Intelligent medical Diagnostic System", 80, 24);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("FEEDBACK REPORT", 85, 35);

  doc.setFontSize(11);
  doc.setFont("helvetica", "light");
  doc.text(
    "Generated on: " +
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date()),
    87,
    40
  );
    doc.setFontSize(13);
    doc.setFont("helvetica");
    doc.text("Doctor Information", 14, 55);
    doc.setFontSize(10);
    doc.setFont("helvetica");
    doc.text("Name", 14, 62);
    doc.setFontSize(10);
    doc.text(`${sessionStorage.getItem("username")}`, 35, 62);
    doc.setFontSize(10);
    doc.setFont("helvetica");
    doc.text("Email", 14, 68);
    doc.setFontSize(10);
    doc.text(`${sessionStorage.getItem("email")}`, 35, 68);

    let reportTitle = "Predicted Diagnoses from Dec 2024 - March 2025";
    if (filter === "currentMonth") {
      const startOfMonth = moment().startOf("month").format("MMMM Do");
      const endOfMonth = moment().endOf("month").format("MMMM Do");
      reportTitle = `Feedback Received from ${startOfMonth} - ${endOfMonth}`;
    } else if (filter === "thisWeek") {
      const startOfWeek = moment().startOf("week").format("MMMM Do");
      const endOfWeek = moment().endOf("week").format("MMMM Do");
      reportTitle = `Feedback Received from ${startOfWeek} - ${endOfWeek}`;
    }

    // Display Report Title
    doc.setFontSize(12);
    doc.setFont("helvetica", "medium");
    doc.text(reportTitle, 14, 80);

  if (filteredFeedback.length === 0) {
    doc.text("No feedback records available for the selected period.", 20, 30);
    doc.save(`Feedback_Report_${filter}.pdf`);
    return;
  }

  const tableColumn = ["Date", "Rating", "Comment"];
  const tableRows = filteredFeedback.map((row) => [
    moment(row.createdAt).format("MMM D, YYYY"),
    row.rating,
    row.comment || "No comment",
  ]);

  doc.autoTable({
    startY: 87,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: { fontSize: 10 },
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

  doc.save(`Feedback_Report_${filter}.pdf`);
};
