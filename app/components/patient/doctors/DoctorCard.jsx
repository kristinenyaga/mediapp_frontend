import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../../loader/Loader";
import { defaultImage } from "@/public/constants/images";
import { FaArrowRight, FaInfoCircle } from "react-icons/fa";
import { useDoctor } from "@/app/context/doctorContext";

const DoctorCard = ({ doctor, onSelect }) => {
  const router = useRouter();
  const { setDoctorId } = useDoctor()
  const [isLoading, setIsLoading] = useState(false);

  const handleBookAppointment = () => {
    setIsLoading(true)
    setDoctorId(doctor.id); 
    router.push("/patient/book-appointment"); 
    setIsLoading(false)
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="border border-gray-200 rounded-lg flex flex-col p-5 shadow transition-all duration-300">
      {/* Doctor Image */}
      <div className="flex justify-center">
        <Image src={defaultImage} className="w-20 h-20 rounded-full object-cover" alt="Doctor Profile" />
      </div>

      {/* Doctor Info */}
      <div className="text-center mt-4">
        <p className="text-[18px] font-medium text-gray-800">
          {doctor ? `Dr. ${doctor.username}` : "N/A"}
          </p>
        <p className="text-[14px] text-gray-600">{doctor.specialization || "General Practitioner"}</p>
        <p className="text-sm text-gray-500">{doctor.yearsOfExperience || "5"} yrs experience</p>
      </div>

      {/* Actions */}
      <div className="flex w-full justify-center items-center gap-3 mt-4">
        {/* View Details */}
        <button
          onClick={() => onSelect(doctor)} // Pass full doctor object for modal
          className="flex items-center justify-center gap-2 border border-gray-400 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:scale-105 shadow-sm hover:bg-gray-100 transition"
        >
          <FaInfoCircle /> View More
        </button>

        {/* Book Appointment */}
        <button
          onClick={handleBookAppointment}
          className="flex items-center justify-center gap-2 border border-blue-600 text-blue-600 text-sm font-medium px-4 py-2 rounded-lg shadow-md hover:scale-105 transition"
        >
          Book Appointment <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
