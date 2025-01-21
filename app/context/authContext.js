"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRole } from './RoleContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { role } = useRole()
  console.log(role)
  const fetchUserDetails = async () => {
  try {
    if (!role) return;

    const endpoint =
      role === "doctor"
        ? "http://localhost:5000/api/doctor/profile"
        : "http://localhost:5000/api/patient/profile";

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
    });

    const { id, email, username } = response.data;
    setUser({ id, email, username });
  } catch (error) {
    console.error("Error fetching user details:", error);
    setUser(null);
  }
};


  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) fetchUserDetails();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
