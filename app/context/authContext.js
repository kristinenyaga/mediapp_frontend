"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useRole } from './RoleContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const { role } = useRole()
  const fetchUserDetails = async () => {
  try {
    if (!role) return;
    let endpoint = ""
    if (role === 'doctor') {
      endpoint = "http://localhost:5000/api/doctor/profile"
    } else if (role === 'patient') {
      endpoint = "http://localhost:5000/api/patient/profile";
    } else {
      endpoint = "http://localhost:5000/api/admin/profile";
    }

    const response = await axios.get(endpoint, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
    });

    const { id, email, username } = response.data;
    setUser({ id, email, username });
    sessionStorage.setItem('email', email)
    sessionStorage.setItem("username", username);
    
  } catch (error) {
    console.error("Error fetching user details:", error);
    setUser(null);
  }
};


  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
      if (token && role) fetchUserDetails();
  }, [role]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
