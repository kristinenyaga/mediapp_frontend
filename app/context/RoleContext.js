// contexts/RoleContext.js
"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const RoleContext = createContext();

export const useRole = () => useContext(RoleContext);

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Check localStorage for the stored role on initial load
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      setRole(storedRole); // Set role from localStorage if available
    }
  }, []);

  const setUserRole = (role) => {
    setRole(role);
    localStorage.setItem('role', role); // Persist role in localStorage
  };

  const value = {
    role,
    setRole: setUserRole,
  };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
