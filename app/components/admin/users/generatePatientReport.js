import jsPDF from "jspdf";
import "jspdf-autotable";

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
export const generatePatientReport = (patientDetails, symptomList) => {
  const doc = new jsPDF();

    const logoUrl = "/images/logo.png";
    doc.addImage(logoUrl, "PNG", 90, 10, 30, 10);
    doc.setFontSize(11);
    doc.setFont("helvetica", "light");
    doc.text("Intelligent medical Diagnostic System", 78, 24);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT REPORT", 83, 35);
  
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
      40
    );



  // Patient Info Section
  doc.setFontSize(14);
  doc.text("Patient Information", 14, 48);
  doc.setFontSize(11);
  doc.text(`Name: ${patientDetails.username}`, 14, 55);
  doc.text(`Age: ${calculateAge(patientDetails.dob)}`, 14, 60);
  doc.text(`Phone: ${patientDetails.phone}`, 14, 65);
  doc.text(
    `Medical Info: ${patientDetails.medicalinformation || "None provided"}`,
    14,
    70
  );

  // Emergency Contact
  if (patientDetails.emergencycontact) {
    doc.setFontSize(14);
    doc.text("Emergency Contact", 14, 83);
    doc.setFontSize(11);
    doc.text(`Name: ${patientDetails.emergencycontact.name}`, 14, 90);
    doc.text(
      `Relationship: ${patientDetails.emergencycontact.relationship}`,
      14,
      95
    );
    doc.text(`Phone: ${patientDetails.emergencycontact.phone}`, 14, 100);
  }

  // Appointments Table
  if (patientDetails.appointments.length > 0) {
    doc.setFontSize(15);
    doc.text("Appointments", 14, 110);

    const appointmentRows = patientDetails.appointments.map((apt, index) => [
      index + 1,
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(apt.date)),
      `${apt.startTime} - ${apt.endTime}`,
      `Dr. ${apt.doctor.username}`,
      apt.status.charAt(0).toUpperCase() + apt.status.slice(1),
    ]);

    doc.autoTable({
      startY: 115,
      head: [["#", "Date", "Time", "Doctor", "Status"]],
      body: appointmentRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
      margin: { top: 10 },
    });
  }

  // Diagnoses Table
  const diagnosedAppointments = patientDetails.appointments.filter(
    (apt) => apt.diagnosis
  );
  if (diagnosedAppointments.length > 0) {
    doc.setFontSize(14);
    doc.text("Diagnoses", 15, doc.autoTable.previous.finalY + 10);

    const getSymptomNames = (symptomIds) => {
      if (!symptomList.length || !symptomIds) return "Unknown";
      return symptomIds
        .map((id) => {
          const symptom = symptomList.find((s) => s.id === id);
          return symptom ? symptom.name : "Unknown";
        })
        .join(", ");
    };

    const diagnosisRows = diagnosedAppointments.map((apt, index) => [
      index + 1,
      new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(apt.date)),
      getSymptomNames(apt.patientSymptom?.symptoms),
      apt.diagnosis.predictedDiagnosis,
      apt.diagnosis.finalDiagnosis || "Not yet confirmed",
      apt.diagnosis.isApproved ? "Approved" : "Pending",
    ]);

    doc.autoTable({
      startY: doc.autoTable.previous.finalY + 55,
      head: [
        [
          "#",
          "Appointment Date",
          "Symptoms",
          "Predicted Diagnosis",
          "Final Diagnosis",
          "Approval",
        ],
      ],
      body: diagnosisRows,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 51, 153], textColor: 255 },
      margin: { top: 10 },
    });
  }

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
    `Page ${doc.internal.getNumberOfPages()}`,
    doc.internal.pageSize.width - 30,
    doc.internal.pageSize.height - 10
  );

  doc.save(`Patient_Report_${patientDetails.username}.pdf`);
};
