"use client";

import React from "react";
import { useRole } from "@/app/context/RoleContext";
import { useRouter } from "next/navigation";
import { doctor, patient, stethoscope } from "@/public/constants/images";
import Image from "next/image";

const WelcomePage = () => {
  const { setRole } = useRole();
  const router = useRouter();

  const handleRoleSelection = (role: string) => {
    setRole(role);
    router.push("/sign-in");
  };

  return (
    <div>
      <p className="px-10 pt-10">Mediapp</p>
      <div className="relative h-screen flex flex-col items-center mt-[6%] px-6">

        <Image src={stethoscope} alt='stethoscope' className="absolute text-[#6B4DE6] text-3xl top-10 left-[20%] animate-pulse" />

        <div className="text-center mb-16">
          <h1 className="text-5xl font_dm_serif mb-3 text-[#6B4DE6] tracking-wide">MediApp</h1>
          <p className="text-gray-600 text-sm mt-2 ">Your trusted medical companion</p>
        </div>

        {/* Role Selection Section */}
        <p className="text-gray-600 text-base mb-6">Choose your role</p>
        <div className="flex gap-10">
          {/* Patient Card */}
          <div
            className="bg-[#ffffff] shadow-md hover:shadow-lg py-8 px-16 cursor-pointer transition-all duration-300 transform hover:scale-105 flex flex-col items-center rounded-lg border border-gray-200"
            onClick={() => handleRoleSelection("patient")}
          >
            <Image src={patient} alt="Patient Icon" width={60} height={60} />
            <p className="text-gray-600 text-lg mt-3">Patient</p>
          </div>

          {/* Doctor Card */}
          <div
            className="bg-white shadow-md hover:shadow-lg py-8 px-14 cursor-pointer transition-all duration-300 transform hover:scale-105 flex flex-col items-center rounded-lg border border-gray-200"
            onClick={() => handleRoleSelection("doctor")}
          >
            <Image src={doctor} alt="Doctor Icon" width={60} height={60} />
            <p className="text-gray-600 text-lg  mt-3">Doctor</p>
          </div>
        </div>

        <p className="text-gray-600 text-sm mt-10">Providing seamless healthcare experiences</p>
      </div>
    </div>

  );
};

export default WelcomePage;
