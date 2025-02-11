import React from 'react';
import { FaUserMd, FaHeartbeat, FaHospitalAlt, FaUser } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center max-w-[1280px] mx-auto gap-12 lg:gap-20 h-[90vh]" id='about'>
      <div className="lg:w-1/2 text-center lg:text-left">
        <p className="text-[#6B4DE6] bg-[#fcf9ff] w-fit p-3 rounded-lg text-sm mb-8">About Us</p>
        <h2 className="text-[32px] font_dm_serif text-[#202020] mt-2 leading-[50px]">
          Empowering <span className="text-[#6B4DE6] font_dm_serif">Healthcare</span> with Smart Diagnostics & Seamless Appointments
        </h2>

        <p className="text-gray-800 mt-8 text-[15px] w-[90%] font_open_sans">
          Our platform empowers both patients and doctors by providing AI-driven symptom analysis
          and an effortless appointment booking system, ensuring fast, accurate, and efficient care.
        </p>

        <div className="grid grid-cols-2 items-center gap-6 mt-10">
          <div className="flex items-center gap-4">
            <FaUserMd className="text-[#FBC343] text-3xl" />
            <p className="text-sm font-medium text-[#202020]">Certified Doctors</p>
          </div>
          <div className="flex items-center gap-4">
            <FaHeartbeat className="text-[#FBC343] text-3xl" />
            <p className="text-sm font-medium text-[#202020]">AI-Powered Health Insights</p>
          </div>
          <div className="flex items-center gap-4">
            <FaHospitalAlt className="text-[#6B4DE6] text-3xl" />
            <p className="text-sm font-medium text-[#202020]">Effortless Appointment Booking</p>
          </div>
          <div className="flex items-center gap-4">
            <FaUser className="text-[#6B4DE6] text-3xl" />
            <p className="text-sm font-semibold text-[#202020]">Patient-Centric Care</p>
          </div>
        </div>
      </div>

      <div className="lg:w-1/2 flex justify-center">
        {/* <Image src={aboutImage} alt="About Us" className="w-[90%] lg:w-[100%] rounded-md" /> */}
      </div>
    </div>
  );
};

export default AboutUs;
