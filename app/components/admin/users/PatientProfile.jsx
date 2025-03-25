"use client"
import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BsDownload } from "react-icons/bs";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdEmail, MdMedicalServices, MdPhone } from "react-icons/md";
import { FaUserShield } from "react-icons/fa";
import GoBack from "../../goBack/GoBack";


export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}


const PatientProfile = () => {
  const { id } = useParams()
  const [patient,setPatient] = useState([])

  useEffect(() => {
    const fetchPatientData = async () => {
      const response = await axios.get(`http://localhost:5000/api/patient/${id}`)
      setPatient(response.data)
    }
    if (id) {
      fetchPatientData()
    }
  }, [id,setPatient])

  if (!patient) {
    return <p>loading ...</p>
  }
  const formatTime = (timestring) => {
    if (!timestring) return "N/A";
    const [hours, minutes] = timestring.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const logoUrl = "/images/logo.png";
    doc.addImage(logoUrl, "PNG", 10, 10, 30, 10);

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT REPORT", 83, 20);

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

    const reportTitle = `${patient.username}'s appointments `
    
    doc.setFontSize(12);
    doc.text(`${patient.username}'s appointments `, 14, 45);
  
  
    const tableColumn  = [
      'Date',
      'Appointment Time',
      'Doctor',
      'status'
    ]
    const tableRows = patient.appointments?.map((row) =>
      tableColumn.map((key) => {
        if (key === "Appointment Time") {
          return `${formatTime(row.startTime)} - ${formatTime(row.endTime)}` || "-"; 
        }
        if (key === "Doctor") {
          return row.doctor.username;
        }
        if (key === "Date") {
          return row.date;
        }
        return row[key] || "-"; 
      })
    );
  
    doc.autoTable({
      startY: 53,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 9 },
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

    doc.save(`${reportTitle.replace(/\s+/g, "_")}.pdf`);
  };

  return (
    <AdminLayout>
      <div className="bg-white shadow-md rounded-xl">
        {/* Patient Info Section */}
        <GoBack/>
        <div className="mb-6 border-b pb-4">
          <h2 className="text-3xl font-medium text-blue-700">{patient.username}</h2>
          <div className="text-gray-600 space-y-1 mt-2">
            <p className="flex items-center gap-2"><MdEmail className="text-blue-600" /> {patient.email}</p>
            <p className="flex items-center gap-2"><MdPhone className="text-blue-600" /> {patient.phone}</p>
          </div>
        </div>

        {/* Emergency Contact Section */}
        {patient?.emergencycontact && (
          <div className="mb-6 p-4 rounded-lg bg-blue-50 shadow-sm">
            <h3 className="text-lg font-medium text-blue-700 flex items-center gap-2">
              <FaUserShield /> Emergency Contact
            </h3>
            <p className="text-gray-700 mt-1">{patient.emergencycontact.name} ({patient.emergencycontact.relationship})</p>
            <p className="text-gray-700">{patient.emergencycontact.phone}</p>
          </div>
        )}

        {/* Medical Information Section */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-green-700 flex items-center gap-2">
            <MdMedicalServices /> Medical Information
          </h3>
          <p className="text-gray-600 mt-2">
            {patient?.medicalinformation ? JSON.stringify(patient?.medicalinformation) : "No medical information available."}
          </p>
        </div>

        {/* Appointments Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium text-blue-700 mb-4 flex items-center gap-2">
            Appointments
          </h3>
          <div className="overflow-x-auto">
            <TableContainer component={Paper} sx={{ mt: 1, border: "1px solid #F9F9F9", boxShadow: "none", borderRadius: "8px" }}>
              <Button
                onClick={() => handleDownloadPDF()}
                sx={{
                  px: 2,
                  mt: 2,
                  ml: 1.7,
                  fontWeight: 500,
                  display: 'flex',
                  gap: 2,
                  alignItems: 'center',
                  fontSize:'16px',
                  bgcolor: 'rgb(0,150, 199, 10%)',
                }}
              >
                Download <BsDownload className="font-medium text-lg" />
              </Button>

              <Table sx={{marginTop:'20px'}}>
                <TableHead sx={{ bgcolor: "#F9F9F9" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "medium", color: "#000",fontSize:'16px' }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: "medium", color: "#000", fontSize: '16px' }}>Appointment Time</TableCell>
                    <TableCell sx={{ fontWeight: "medium", color: "#000", fontSize: '16px' }}>Doctor</TableCell>
                    <TableCell sx={{ fontWeight: "medium", color: "#000",fontSize:'16px' }}>Status</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {patient.appointments?.length > 0 ? (
                    patient.appointments.map((appointment) => (
                      <TableRow key={appointment.id} sx={{ "&:hover": { bgcolor: "#F9FAFB" } }}>
                        <TableCell sx={{ fontWeight: "medium", color: "#363D3A", fontSize: '15px' }}>{appointment.date}</TableCell>

                        <TableCell sx={{ fontWeight: "medium", color: "#363D3A", fontSize: '15px' }}>{`${formatTime(appointment?.startTime)} - ${formatTime(appointment?.endTime)}`}</TableCell>
                        <TableCell sx={{ fontWeight: "medium", color: "#363D3A", fontSize: '15px' }}>Dr. {appointment.doctor.username}</TableCell>
                        <TableCell>
                          <span
                            className={`px-3 py-2 rounded-lg text-white text-sm font-medium ${appointment.status === "completed"
                                ? "bg-brand-600"
                                : appointment.status === "pending"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                          >
                            {appointment.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-gray-500">
                        No Appointments
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientProfile;
