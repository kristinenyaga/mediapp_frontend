"use client";

import React, { useState } from "react";
import { useRole } from "@/app/context/RoleContext";
import { useRouter } from "next/navigation";
import { doctor, logo, patient, admin } from "@/public/constants/images";
import Image from "next/image";
import LoadingScreen from "../loader/Loader";
import { FaUserMd, FaUserInjured, FaUserShield } from "react-icons/fa";

const WelcomePage = () => {
  const { setRole } = useRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = (role: string) => {
    setLoading(true);
    setRole(role);
    router.push("/sign-in");
    setLoading(false);
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-6">
      {/* Logo Section */}
      <div className="absolute top-6 left-10 flex items-center">
        <Image src={logo} width={180} height={20} alt="MediQueue Logo" />
      </div>

      {/* Welcome Content */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-medium tracking-wide">MediQueue Portal</h1>
        <p className="text-gray-700 mt-2 text-base">Your Trusted Medical Companion for Seamless Healthcare Management</p>
      </div>

      {/* Role Selection */}
      <div className="w-full max-w-4xl">
        <p className="text-lg font-medium text-gray-700 text-center mb-6">Choose Your Role</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Patient Card */}
          <div
            className="flex flex-col items-center p-6 bg-white shadow-lg hover:shadow-xl rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => handleRoleSelection("patient")}
          >
            <FaUserInjured className="text-5xl text-blue-600 mb-3" />
            <p className="text-xl font-medium text-gray-700">Patient</p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Book appointments and manage your medical history.
            </p>
          </div>

          {/* Doctor Card */}
          <div
            className="flex flex-col items-center p-6 bg-white shadow-lg hover:shadow-xl rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => handleRoleSelection("doctor")}
          >
            <FaUserMd className="text-5xl text-green-600 mb-3" />
            <p className="text-xl font-medium text-gray-800">Doctor</p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              View patient appointments and provide medical care.
            </p>
          </div>

          {/* Admin Card */}
          <div
            className="flex flex-col items-center p-6 bg-white shadow-lg hover:shadow-xl rounded-lg border border-gray-200 cursor-pointer transition-all duration-300 transform hover:scale-105"
            onClick={() => handleRoleSelection("admin")}
          >
            <FaUserShield className="text-5xl text-purple-600 mb-3" />
            <p className="text-xl font-medium text-gray-800">Admin</p>
            <p className="text-sm text-gray-500 mt-1 text-center">
              Manage system users, doctors, and reports.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-5 text-sm text-gray-600">
        &copy; 2025 MediQueue. All Rights Reserved.
      </div>
    </div>
  );
};

export default WelcomePage;
