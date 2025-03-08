"use client"
import React, { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import { useParams } from "next/navigation";
import axios from "axios";
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { BsDownload } from "react-icons/bs";
import jsPDF from "jspdf";
import "jspdf-autotable";
interface Appointment {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

interface Patient {
  id: number;
  username: string;
  email: string;
  phone: string;
  appointments: Appointment[];
  emergencycontact: EmergencyContact | null;
  medicalinformation: any;
}

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}


const PatientProfile = () => {
  const { id } = useParams()
  const [patient,setPatient] = useState<Patient | null>([])

  useEffect(() => {
    const fetchPatientData = async () => {
      const response = await axios.get(`http://localhost:5000/api/patient/${id}`)
      setPatient(response.data)
    }
    if (id) {
      fetchPatientData()
    }
  }, [id])

  if (!patient) {
    return <p>loading ...</p>
  }
  
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
      'date',
      'Appointment Time',
      'status'
    ]
    const tableRows = patient.appointments?.map((row) =>
      tableColumn.map((key) => {
        if (key === "Appointment Time") {
          return `${row.startTime} - ${row.endTime}` || "-"; 
        }
        return row[key] || "-"; 
      })
    );
  
    doc.autoTable({
      startY: 53,
      head: [tableColumn],
      body: tableRows,
      styles: { fontSize: 7 },
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
      <div className=" bg-white rounded-lg">
        <div className="mb-6">
          <h2 className="text-2xl font-medium">{patient.username}</h2>
          <p className="text-gray-600">{patient.email}</p>
          <p className="text-gray-600">{patient.phone}</p>
        </div>

        {patient?.emergencycontact && (
          <div className="mb-6">
            <h3 className="text-lg font-medium ">Emergency Contact</h3>
            <p className="text-gray-600">{patient.emergencycontact.name} ({patient.emergencycontact.relationship})</p>
            <p className="text-gray-600">{patient.emergencycontact.phone}</p>
          </div>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-medium ">Medical Information</h3>
          <p className="text-gray-500">
            {patient?.medicalinformation ? JSON.stringify(patient?.medicalinformation) : "No medical information available."}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-medium  my-4 mt-6">Appointments</h3>
          <div className="overflow-x-auto w-[90%]">
            <TableContainer component={Paper} sx={{ mt: 1, border: "1px solid #F9F9F9", boxShadow: "none", borderRadius: "8px" }}>
              <Button onClick={()=>handleDownloadPDF()} sx={{ px: 2, mt: 2, ml: 1.7, fontWeight: 500, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'rgb(0,150, 199, 10%)' }}>download <BsDownload className=" font-medium text-lg" /></Button>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontWeight:'semibold'}}>Date</TableCell>
                    <TableCell sx={{fontWeight:'semibold'}}>Appointment Time</TableCell>
                    <TableCell sx={{fontWeight:'semibold'}}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patient.appointments?.length > 0 ? (
                    patient.appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell>{appointment.date}</TableCell>
                        <TableCell>{`${appointment.startTime} - ${appointment.endTime}`}</TableCell>
                        <TableCell>{appointment.status}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center">
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
