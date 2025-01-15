"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUserDetails = async () => {
    try {
      console.log(sessionStorage.getItem('access_token'))
      const response = await axios.get('http://localhost:5000/api/patient/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
      });
      const { id, email, username } = response.data; 
      setUser({ id, email, username });
    } catch (error) {
      console.error('Error fetching user details:', error);
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
