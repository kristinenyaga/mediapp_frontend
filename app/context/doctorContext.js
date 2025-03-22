"use client";
import { createContext, useContext, useState } from "react";

const DoctorContext = createContext();

export const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (!context) {
    throw new Error("useDoctor must be used within a DoctorProvider");
  }
  return context;
};

export const DoctorProvider = ({ children }) => {
  const [selectedDoctor, setSelectedDoctorId] = useState(null);


  // Function to set doctor ID and persist it
  const setDoctorId = (doctorId) => {
    try {
      setSelectedDoctorId(doctorId);
      localStorage.setItem("selectedDoctor", doctorId); // Store as string
    } catch (error) {
      console.error("Failed to save doctor ID to localStorage:", error);
    }
  };

  return (
    <DoctorContext.Provider value={{ selectedDoctor, setDoctorId }}>
      {children}
    </DoctorContext.Provider>
  );
};
