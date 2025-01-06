"use client";

import Image from "next/image";
import React from "react";
import { useRole } from "@/app/context/RoleContext";
import { useRouter } from "next/navigation";
import { doctor, patient } from "@/public/constants/images";

const WelcomePage = () => {
  const { setRole } = useRole();
  const router = useRouter();

  const handleRoleSelection = (role: string) => {
    setRole(role);
    router.push("/sign-in");
  };

  return (
    <div className="flex flex-col gap-3 justify-center items-center h-[80vh]">
      <div className="flex items-center gap-1">
        <p className="text-display-xs text-gray-700">Welcome to</p>
        <p className="text-display-xs text-blue-300">MediApp</p>
      </div>
      <p className="text-gray-500">Select your role</p>
      <div className="flex gap-10 mt-10">
        <div
          className="border border-[#C1C3C2] rounded-md py-5 px-10 cursor-pointer"
          onClick={() => handleRoleSelection("patient")}
        >
          <Image src={patient} alt="Patient Icon" />
          <p className="text-center pt-2 text-gray-500">Patient</p>
        </div>
        <div
          className="border border-[#C1C3C2] rounded-md py-5 px-10 cursor-pointer"
          onClick={() => handleRoleSelection("doctor")}
        >
          <Image src={doctor} alt="Doctor Icon" />
          <p className="text-center pt-2 text-gray-500">Doctor</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
