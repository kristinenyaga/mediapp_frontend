"use client";
import React, { useEffect, useState } from "react";
import DoctorLayout from "../doctorLayout";
import { CiNoWaitingSign } from "react-icons/ci";
import { Radio, RadioGroup, FormControlLabel, FormControl, Button } from "@mui/material";
import axios from "axios";
import { useParams } from "next/navigation";
import { Notify } from "notiflix";
import api from "@/app/utils/axiosInstance";
import { useRole } from "@/app/context/RoleContext";
import GoBack from "../../goBack/GoBack";
import { MdCancel, MdCheckCircle } from "react-icons/md";

const Appointment = () => {
  const { id } = useParams();
  const { role } = useRole();
  const [appointment, setAppointment] = useState({});
  const [diagnosis, setDiagnosis] = useState(null);
  const [doctorDiagnosis, setDoctorDiagnosis] = useState("");
  const [value, setValue] = useState("");
  const [diagnosisError, setDiagnosisError] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    const fetchAppointment = async () => {
      const response = await axios.get(`http://localhost:5000/api/appointment/${id}`);
      setAppointment(response.data);
    };
    fetchAppointment();
  }, [id]);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      const response = await axios.get(`http://localhost:5000/api/diagnosis/${id}`);
      setDiagnosis(response.data);
    };
    fetchDiagnosis();
  }, [id]);

  const handleDiagnosisChange = (event) => {
    setDoctorDiagnosis(event.target.value);
  };

  const markAppointmentCompleted = async () => {
    try {
      setAppointment({ ...appointment, status: "completed" });

      await api.post(
        `/api/appointment/${id}/status`,
        { status: "completed" },
        { _role: role }
      );
      Notify.success("Appointment marked as completed!");
    } catch (error) {
      Notify.failure(error.response?.data?.message || "Failed to update appointment status.");
    }
  };

  const handleSubmit = async () => {
    if (!doctorDiagnosis) {
      setDiagnosisError(true);
      return;
    }
    setDiagnosisError(false);

    try {
      await axios.patch(`http://localhost:5000/api/diagnosis/disapprove/${id}`, {
        finalDiagnosis: doctorDiagnosis,
      });

      setStatusMessage("Predicted diagnosis was disapproved.");
      setDiagnosis({ ...diagnosis, finalDiagnosis: doctorDiagnosis, isApproved: false });

      Notify.success("Diagnosis submitted successfully!");
    } catch (error) {
      Notify.failure(error.response.data);
    }
  };

  const handleApproveDiagnosis = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/diagnosis/approve/${id}`);

      setStatusMessage("Predicted diagnosis was approved.");
      setDiagnosis({ ...diagnosis, isApproved: true });

      Notify.success("Diagnosis approved successfully!");
    } catch (error) {
      Notify.failure(error.response?.data?.message || "Something went wrong!");
    }
  };

  const calculateAge = (dobString) => {
    const dob = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  return (
    <DoctorLayout>
      <div className="w-[90%]">
        <GoBack />
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-medium text-blue-700">Appointment Details</h2>
          <p className={`px-5 py-3 rounded-md ${appointment.status === 'completed' ? 'bg-brand-100 text-brand-500' : appointment.status === 'cancelled' ? 'bg-red-100 text-red-300' : 'text-amber-600 bg-amber-100'}`}>
            {appointment.status}
          </p>
        </div>

        {/* Patient Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4 border-gray-200">
            <h3 className="text-xl font-medium text-gray-800 mb-3">Patient Information</h3>
            <p className="text-gray-600 text-base"><strong>Name:</strong> {appointment?.patient?.username}</p>
            <p className="text-gray-600 mt-2 text-base"><strong>Age:</strong> {calculateAge(appointment?.patient?.dob)} years</p>
            <p className="text-gray-600 mt-2 text-base"><strong>Gender:</strong> {appointment?.patient?.gender}</p>
          </div>

          {/* Model Prediction */}
          <div className="border rounded-lg p-4 border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Model Prediction</h3>
            <p className="text-blue-700 bg-blue-50 rounded-md text-xl w-fit px-4 py-2 font-semibold capitalize">
              {appointment?.patientSymptom?.symptoms.length > 0 ? diagnosis?.predictedDiagnosis || 'loading...' : 'No Diagnosis'}
            </p>
          </div>
        </div>

        {/* Symptoms */}
        <div className="mt-6 rounded-lg p-4 border border-gray-200">
          <h3 className="text-xl font-medium text-gray-800 mb-3">Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {appointment?.patientSymptom?.symptoms.length > 0 ? (
              appointment?.patientSymptom?.symptoms.map((symptom, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 rounded-md text-gray-800 text-base">
                  {symptom?.name}
                </span>
              ))
            ) : (
              <p className="text-gray-500 flex items-center gap-2">
                <CiNoWaitingSign className="text-lg" /> No symptoms reported
              </p>
            )}
          </div>
        </div>

        {/* Doctor's Decision */}
        {statusMessage ? (
            <div
              className={`mt-6 border rounded-lg p-4 flex items-center gap-3 ${
                diagnosis?.isApproved
                  ? "bg-brand-100 border-brand-200 text-brand-600" 
                  : "bg-red-100 border-red-200 text-red-700" 
              }`}
            >
              {diagnosis?.isApproved ? (
                <MdCheckCircle className="text-2xl text-brand-600" /> 
              ) : (
                <MdCancel className="text-2xl text-red-700" /> 
              )}

              <div>
                <h3 className="text-lg font-medium">{statusMessage}</h3>
              {doctorDiagnosis && (
                <div className="flex items-center gap-5">
                  <p className="text-lg">Doctor Diagnosis is:</p>
                  <p className="text-lg font-medium capitalize">{doctorDiagnosis}</p>
                </div>
                )}
              </div>
            </div>
        ) : (
            diagnosis?.predictedDiagnosis && ( 
              <div className="mt-6 border rounded-lg p-4 border-gray-200">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Is the predicted diagnosis accurate?</h3>
                <FormControl>
                  <RadioGroup
                    name="diagnosis-accuracy"
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                      if (event.target.value === "yes") {
                        handleApproveDiagnosis();
                      }
                    }}
                    className="flex flex-row gap-6"
                  >
                    <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                    <FormControlLabel value="no" control={<Radio />} label="No" />
                  </RadioGroup>
                </FormControl>
              </div>
            )

        )}

        {/* Diagnosis Input (if incorrect prediction) */}
        {value === "no" && (
          <div className="mt-6 border rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Provide Correct Diagnosis</h3>
            <input
              type="text"
              className={`w-full mb-5 p-3 border rounded-lg outline-none ${diagnosisError ? "border-red-500" : "border-gray-300 focus:border-gray-500"}`}
              placeholder="Enter diagnosis"
              value={doctorDiagnosis}
              onChange={handleDiagnosisChange}
            />
            <Button className="mt-6" onClick={handleSubmit} variant="contained" color="primary">
              Submit
            </Button>
          </div>
        )}
        {
          appointment.status !== "completed" && appointment.status !== "cancelled" && (
            <div className="mt-6 flex items-center gap-3">
              <input
                type="checkbox"
                className="w-5 h-5 accent-brand-500"
                checked={appointment.status === "completed"}
                onChange={markAppointmentCompleted}
              />
              <label className="text-gray-800 cursor-pointer" onClick={markAppointmentCompleted}>
                Mark appointment as completed
              </label>
            </div>
          )
        }
      </div>
    </DoctorLayout>
  );
};

export default Appointment;
