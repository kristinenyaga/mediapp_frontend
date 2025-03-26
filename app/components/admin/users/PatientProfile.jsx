"use client";
import React, { useEffect, useState } from "react";
import GoBack from "../../goBack/GoBack";
import { useParams } from "next/navigation";
import api from "@/app/utils/axiosInstance";
import { Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from "@mui/material";
import { BsDownload } from "react-icons/bs";
import { generatePatientReport } from "./generatePatientReport";
import AdminLayout from "../AdminLayout";
const PatientDetails = () => {
  const { id } = useParams();
  const [patientDetails, setPatientDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [symptomList, setSymptomList] = useState([]);

useEffect(() => {
  const fetchSymptoms = async () => {
    try {
      const response = await api.get("/api/symptoms");
      setSymptomList(response.data); // Store symptoms in state
    } catch (error) {
      console.error("Error fetching symptoms:", error);
    }
  };
  fetchSymptoms();
}, []);
  const getSymptomNames = (symptomIds) => {
  if (!symptomList.length || !symptomIds) return [];

  return symptomIds
    .map((id) => {
      const symptom = symptomList.find((s) => s.id === id);
      return symptom ? symptom.name : "Unknown Symptom";
    })
    .join(", ");
};

const calculateAge = (dobString) => {
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
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await api.get(`/api/patient/${id}`);
        setPatientDetails(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatientDetails();
  }, [id]);

  if (loading) return <p className="text-gray-600 text-center mt-6">Loading patient details...</p>;
  if (!patientDetails) return <p className="text-red-500 text-center mt-6">Patient details not found.</p>;

  return (
    <AdminLayout>
      <div className="w-[90%]">
        
        <GoBack />
        <div className="flex gap-5">
          <h2 className="text-[28px] mt-4 font-medium text-blue-700">Patient Details</h2>
          <button onClick={() => generatePatientReport(patientDetails, symptomList)} className="flex gap-2 items-center p-3 pl-3 bg-[#6c4de60a] text-base rounded-md m-3 text-blue-700">download <BsDownload className=" font-medium text-lg text-blue-700" /></button>
        </div>

        <div className="border p-6 mt-6">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Patient Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 rounded-md">
              <p className="text-gray-700"><strong>Name:</strong> {patientDetails.username}</p>
            </div>

            <div className="flex items-center gap-3 rounded-md">
              <p className="text-gray-700"><strong>Age:</strong> {calculateAge(patientDetails.dob)}</p>
            </div>

            <div className="flex items-center gap-3 rounded-md">
              <p className="text-gray-700"><strong>Phone:</strong> {patientDetails.phone}</p>
            </div>

            <div className="flex items-center gap-3 rounded-md">
              <p className="text-gray-700"><strong>Medical Info:</strong> {patientDetails.medicalinformation || "None provided"}</p>
            </div>
          </div>
        </div>

        {patientDetails.emergencycontact && (
          <div className="border p-6 mt-6">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Emergency Contact</h3>
        
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 rounded-md">
                <p className="text-gray-700"><strong>Name:</strong> {patientDetails.emergencycontact.name}</p>
              </div>
        
              <div className="flex items-center gap-3 rounded-md">
                <p className="text-gray-700"><strong>Relationship:</strong> {patientDetails.emergencycontact.relationship}</p>
              </div>
        
              <div className="flex items-center gap-3 rounded-md">
                <p className="text-gray-700"><strong>Phone:</strong> {patientDetails.emergencycontact.phone}</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-10">
          <h3 className="text-xl font-medium text-blue-700">Appointments</h3>
          {patientDetails.appointments.length > 0 ? (
            <TableContainer component={Paper} className="mt-4 max-h-64 overflow-y-auto">
              <Table stickyHeader>
                <TableHead>
                  <TableRow className="bg-blue-100">
                    <TableCell><strong>Date</strong></TableCell>
                    <TableCell><strong>Time</strong></TableCell>
                    <TableCell><strong>Doctor</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientDetails.appointments.map((appointment) => (
                    <TableRow key={appointment.id} className="hover:bg-gray-50">
                      <TableCell>
                        {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(appointment.date))}
                      </TableCell>
                      <TableCell>{appointment.startTime} - {appointment.endTime}</TableCell>
                      <TableCell>Dr. {appointment.doctor.username}</TableCell>
                      <TableCell className={appointment.status === "pending" ? "text-orange-600" : "text-green-600"}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="text-gray-600 mt-4">No appointments found.</p>
          )}
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-medium text-blue-700">Diagnoses</h3>
          {patientDetails.appointments.some((apt) => apt.diagnosis) ? (
            <TableContainer component={Paper} className="mt-4 max-h-64 overflow-y-auto">
              <Table stickyHeader>
                <TableHead>
                  <TableRow className="bg-blue-100">
                    <TableCell><strong>Appointment Date</strong></TableCell>
                    <TableCell><strong>Symptoms</strong></TableCell>
                    <TableCell><strong>Predicted Diagnosis</strong></TableCell>
                    <TableCell><strong>Final Diagnosis</strong></TableCell>
                    <TableCell><strong>Approval Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {patientDetails.appointments
                    .filter((appointment) => appointment.diagnosis) // Only include diagnosed appointments
                    .map((appointment) => (
                      <TableRow key={appointment.diagnosis.id} className="hover:bg-gray-50">
                        <TableCell>
                          {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(appointment.date))}
                        </TableCell>
                        <TableCell>
                          {getSymptomNames(appointment.patientSymptom?.symptoms)}
                        </TableCell>
                        <TableCell>{appointment.diagnosis.predictedDiagnosis}</TableCell>
                        <TableCell>{appointment.diagnosis.finalDiagnosis || "Not yet confirmed"}</TableCell>
                        <TableCell className={appointment.diagnosis.isApproved ? "text-green-600" : "text-red-600"}>
                          {appointment.diagnosis.isApproved ? "Approved" : "Pending"}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <p className="text-gray-600 mt-4">No diagnoses found.</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default PatientDetails;
