import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../../loader/Loader";
import { doctorDp } from "@/public/constants/images";
import { FaArrowRight } from "react-icons/fa";

const DoctorCard = ({ doctor, onSelect }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) return <LoadingScreen />;

  return (
    <div
      onClick={() => {
        setIsLoading(true);
        router.push(`/patient/doctor-details/${doctor.id}`);
        onSelect(doctor.id);
        setIsLoading(false);
      }}
      className="border border-gray-300 rounded-lg flex items-center gap-4 p-5 cursor-pointer hover:shadow-md transition-all duration-300"
    >
      {/* Doctor Image */}
      <Image src={doctorDp} className="w-16 h-16 rounded-full object-cover" alt="Doctor Profile" />

      {/* Doctor Info */}
      <div className="flex-1">
        <p className="text-[18px] font-medium text-gray-800">{doctor.username}</p>
        <p className="text-[14px] text-gray-600">{doctor.specialty || "General Practitioner"}</p>
        <p className="text-sm text-gray-500">{doctor.experience || "5"} yrs experience</p>
      </div>

      {/* Book Appointment Button */}
      <button className="flex items-center gap-2 bg-brand-500 text-white text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition">
        Book Appointment <FaArrowRight />
      </button>
    </div>
  );
};

export default DoctorCard;
