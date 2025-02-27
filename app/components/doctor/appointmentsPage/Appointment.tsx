"use client";
import React, { useState } from "react";
import DoctorLayout from "../doctorLayout";
import { CiNoWaitingSign } from "react-icons/ci";
import { Radio, RadioGroup, FormControlLabel, FormControl } from "@mui/material";

const Appointment = () => {
  const [appointment, setAppointment] = useState({
    patient: {
      name: "John Doe",
      age: 35,
      gender: "Male",
      symptoms: ["Fever", "Cough", "Headache"],
    },
    modelPrediction: "Flu",
    doctorDecision: "Pending",
    status: "In Review",
    doctorDiagnosis: "",
    completed: false,
  });

  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleDiagnosisChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAppointment({ ...appointment, doctorDiagnosis: event.target.value });
  };

  const toggleCompleted = () => {
    setAppointment({ ...appointment, completed: !appointment.completed });
  };

  return (
    <DoctorLayout>
      <div className="w-[90%]">
        {/* Title */}
        <h2 className="text-2xl font-medium text-blue-700 mb-6">Appointment Details</h2>

        {/* Patient Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4 border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Patient Information</h3>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Name:</span> {appointment.patient.name}
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              <span className="font-medium">Age:</span> {appointment.patient.age} years
            </p>
            <p className="text-gray-600 mt-2 text-sm">
              <span className="font-medium">Gender:</span> {appointment.patient.gender}
            </p>
          </div>

          {/* Model Prediction */}
          <div className="border rounded-lg p-4 border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-3">Model Prediction</h3>
            <p className="text-blue-700 bg-blue-50 rounded-md text-xl w-fit px-4 py-2 font-semibold">
              {appointment.modelPrediction}
            </p>
          </div>
        </div>

        {/* Symptoms */}
        <div className="mt-6 rounded-lg p-4 border border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Symptoms</h3>
          <div className="flex flex-wrap gap-2">
            {appointment?.patientSymptom?.symptoms.length > 0 ? (
              appointment?.patientSymptom?.symptoms.map((symptom, index) => (
                <span key={index} className="px-3 py-1 bg-gray-200 rounded-md text-gray-800 text-sm">
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
        <div className="mt-6 border rounded-lg p-4 border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">Is the predicted diagnosis accurate?</h3>
          <FormControl>
            <RadioGroup
              name="diagnosis-accuracy"
              value={value}
              onChange={handleChange}
              className="flex flex-row gap-6"
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </div>

        {/* Diagnosis Input (if incorrect prediction) */}
        {value === "no" && (
          <div className="mt-6 border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Provide Correct Diagnosis</h3>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Enter diagnosis"
              value={appointment.doctorDiagnosis}
              onChange={handleDiagnosisChange}
            />
          </div>
        )}

        {/* Mark as Completed */}
        <div className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            className="w-5 h-5 accent-brand-500 text-white"
            checked={appointment.completed}
            onChange={toggleCompleted}
          />
          <label className="text-gray-800">Mark appointment as completed</label>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default Appointment;
