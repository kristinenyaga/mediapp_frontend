import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../../loader/Loader";
const DoctorCard = ({ doctor, onSelect }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  if(isLoading) return <LoadingScreen />
  return (
    <div
      className="border border-gray-300 shadow-sm rounded-lg p-4 cursor-pointer hover:shadow-md transition"
      onClick={() => {
        setIsLoading(true)
        router.push(`/patient/doctor-details/${doctor.id}`)
        onSelect(doctor.id)
        setIsLoading(false)
      }
      }
    >
      <div className="flex items-center">
        {/* Doctor's Profile Picture */}
        {/* <Image
          src={doctor.profilePicture || "/placeholder.png"}
          alt={`${doctor.username} profile`}
          className="w-16 h-16 rounded-full border border-gray-200 mr-4"
        /> */}
        <div>
          <p className="text-[18px] font-medium text-gray-600">{doctor.username}</p>
          <p className="text-[14px] text-secondary font-medium">{doctor.specialty || "General Practitioner"}</p>
        </div>
      </div>

      <div className="flex justify-between w-full items-end">
        <div className="mt-4 flex flex-col gap-2">
          <p className="text-sm text-gray-500">
            <span className="font-medium">Experience:</span> {doctor.experience || "N/A"} years
          </p>
          <p className="text-sm text-brand-600">
            <span className="font-medium">Availability: <span className="text-gray-600 font-medium">{doctor.availability || "Mon - Fri"}</span></span> 
          </p>
        </div> 
        <p className="lg:mr-2 bg-secondary flex justify-center items-center py-1.5 rounded-md text-white px-4">
          select
        </p>
      </div>

    </div>
  );
};

export default DoctorCard;
