"use client"
import React, { useState } from "react";
import { FaUserPlus, FaClipboardList, FaStethoscope, FaCalendarCheck, FaUserMd, FaLaptopMedical, FaNotesMedical, FaCheckDouble } from "react-icons/fa";

const patientSteps = [
  { icon: <FaUserPlus />, title: "Sign Up", description: "Create an account to get started." },
  { icon: <FaClipboardList />, title: "Enter Symptoms", description: "Describe your symptoms for analysis." },
  { icon: <FaStethoscope />, title: "Get Diagnosis", description: "Receive an AI-powered diagnosis." },
  { icon: <FaCalendarCheck />, title: "Book Appointment", description: "Schedule a physical consultation with a doctor." }
];

const doctorSteps = [
  { icon: <FaUserMd />, title: "Create Profile", description: "Sign up and set up your professional profile." },
  { icon: <FaLaptopMedical />, title: "Manage Appointments", description: "Review patient bookings and availability." },
  { icon: <FaNotesMedical />, title: "Analyze Cases", description: "Check AI-generated diagnoses and patient history." },
  { icon: <FaCheckDouble />, title: "Provide Care", description: "Confirm diagnoses and give expert medical advice." }
];

const ProgressiveStack = () => {
  const [isPatient, setIsPatient] = useState(true);
  const steps = isPatient ? patientSteps : doctorSteps;

  return (
    <div className=" flex flex-col items-center" id="works">
      <h2 className="text-[44px] font-medium font_dm_serif text-center ">
        How It Works
      </h2>
      <p className="text-gray-600 mt-2 text-center">
        A simple and seamless process to get the care you need.
      </p>

      {/* Toggle Switch */}
      <div className="flex items-center gap-4 bg-[#6c4de618] shadow-md p-2 rounded-full mt-6">
        <button
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${isPatient ? "bg-[#6B4DE6] text-white" : "text-[#6B4DE6]"}`}
          onClick={() => setIsPatient(true)}
        >
          Patient
        </button>
        <button
          className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${!isPatient ? "bg-[#6B4DE6] text-white" : "text-[#6B4DE6]"}`}
          onClick={() => setIsPatient(false)}
        >
          Doctor
        </button>
      </div>
      <div className="relative w-full max-w-2xl mt-12 font_open_sans">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`relative p-8 rounded-lg border border-gray-300 shadow-md transform transition-all hover:scale-105 hover:shadow-lg ${index % 2 === 0 ? "rotate-2" : "-rotate-2"} bg-white`}
            style={{ top: `${index * 50}px` }}
          >
            <div className="flex items-center gap-4">
              <div className="text-[#6B4DE6] text-3xl">{step.icon}</div>
              <div>
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-[50%] transform -translate-x-1/2 top-full h-12 w-2 bg-[#6B4DE6]"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressiveStack;
