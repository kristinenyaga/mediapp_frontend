import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "../../loader/Loader";
import { doctorDp } from "@/public/constants/images";
import { ArrowRightIcon } from "@mui/x-date-pickers/icons";
const DoctorCard = ({ doctor, onSelect }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  if(isLoading) return <LoadingScreen />
  return (
    <>
      <div onClick={() => {
        setIsLoading(true)
        router.push(`/patient/doctor-details/${doctor.id}`)
        onSelect(doctor.id)
        setIsLoading(false)
      }
      } className='border border-gray-300 rounded-md flex justify-between items-center cursor-pointer hover:scale-105  p-5'>
        <div>
          <Image src={doctorDp} alt='doctorDp' />
        </div>
        <div>
          <div className='flex items-center justify-between'>
            <div>
              <p className="text-[18px] font-medium text-gray-700">{doctor.username}</p>
              <p className="text-[14px] text-blue-700 font-medium">{doctor.specialty || "General Practitioner"}</p>

            </div>
            <div className='flex items-center justify-center px-4 py-4 rounded-full'>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <div>
              <p className='text-gray-600 leading-relaxed text-[13px]'>Lorem ipsum dolor sit amet consectur adipisc elit sed eiusmod tempor</p>
              <p className="text-sm text-gray-600 mt-4">{doctor.experience || "5"} yrs experience</p>
              <p className="text-sm text-brand-600 font-medium mt-1">Available Today</p>
            </div>
            <div>
              <ArrowRightIcon className="text-gray-500 mt-16"/>
            </div>
          </div>
        </div>
      </div>
      {/* <div
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

      </div> */}
    </>

  );
};

export default DoctorCard;
