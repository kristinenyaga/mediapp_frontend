"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Store the user's details (email, username, etc.)
  const [forceRender, setForceRender] = useState(false); // Force re-render state

  // Function to decode the token and update the user context
  const setUserFromToken = (token) => {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode payload
      setUser({
        email: decodedToken.email,
        username: decodedToken.username,
      });
    } catch (error) {
      console.error('Failed to decode token', error);
      setUser(null);
    }
  };

  // On initial load, check if a token exists in sessionStorage and set user details
  useEffect(() => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      setUserFromToken(token);
    }
  }, []); // Only run on mount

  // Listen for changes in sessionStorage to update context
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'access_token' && event.newValue) {
        setUserFromToken(event.newValue); // Update user from new token
        setForceRender(prev => !prev); // Force a re-render
      }
    };

    // Attach event listener
    window.addEventListener('storage', handleStorageChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Only run on mount

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
