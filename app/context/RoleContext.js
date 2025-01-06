"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const RoleContext = createContext();

// Custom hook to access the RoleContext
export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

// Provider Component
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null); // Default state

  // Initialize role from localStorage
  useEffect(() => {
    try {
      const storedRole = localStorage.getItem("role");
      if (storedRole) {
        setRole(storedRole);
      }
    } catch (error) {
      console.error("Failed to read role from localStorage:", error);
    }
  }, []);

  // Function to set role and persist it
  const setUserRole = (newRole) => {
    try {
      setRole(newRole);
      localStorage.setItem("role", newRole); // Persist role
    } catch (error) {
      console.error("Failed to save role to localStorage:", error);
    }
  };

  // Context value
  const value = {
    role,
    setRole: setUserRole,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
