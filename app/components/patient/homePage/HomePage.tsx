"use client";

import React from "react";
import { FiCalendar } from "react-icons/fi";
import PatientLayout from "../patientLayout";
import { FaCheck } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";

const HomePage = () => {
  return (
    <PatientLayout>
      <div className="w-[95%] min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl mt-4 font-medium text-secondary">
              Welcome Back, Kristine <span className=" animate-bounce">👋</span> 
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Here's a quick overview of your medical history.
            </p>
          </div>

          {/* Book Appointment Button */}
          <button className="bg-secondary text-white px-6 py-3 animate-bounce text-sm font-medium rounded-md flex items-center gap-2 transition">
            <FiCalendar size={16} />
            Book Appointment
          </button>
        </header>
        <div>

        </div>


        <section className="mt-8">
          {/* <h2 className="text-lg font-medium text-gray-800 mb-4">Your Stats</h2> */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-[#0095c70a] rounded-md p-5">
              <h2 className=" mb-4">Queue Information</h2>
                <div className="">
                  <div className="flex justify-between pb-2">
                    <p className="text-gray-600 text-[15px]">Queue Number</p>
                    <span className=" font-medium text-base">#10</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <p className="text-gray-600 text-[15px]">Current Position</p>
                    <span className=" font-medium">5</span>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-gray-600 text-[15px]">People Ahead</p>
                    <span className="font-medium">4</span>
                  </div>
                </div>
            </section>
            <div className="bg-brand-100 px-6 py-4 rounded-md">
              <p className="text-gray-800">Next Appointment</p>
              <p className="text-brand-600 text-xl font-semibold mt-2">Feb 10, 2025</p>
              <p className="text-gray-500 text-xs mt-2">Room 305</p>
              <button className="mt-4 font-medium text-brand-600 text-sm flex items-center gap-2 ">view details <BsArrowUpRight/></button>
            </div>
            <div className="bg-yellow-50 px-6 py-4 rounded-md">
              <div className="flex justify-between items-center">
                <p className="text-gray-800">Last Appointment</p>
                <p className="mt-2 text-sm flex gap-2 items-center text-brand-600">completed <FaCheck /></p>
              </div>
              <p className="text-yellow-600 text-xl font-semibold mt-2">Dec 10, 2024</p>
              <p className="text-gray-500 text-xs mt-2">with Dr Smith</p>
            </div>
            <div className="bg-[#6c4de612] px-6 py-4 rounded-md">
              <p className="text-gray-800">Total Appointments</p>
              <p className="text-secondary text-xl font-bold">12</p>
              <p className="text-gray-500 text-xs mt-1">Since 2024</p>
            </div>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Previous Visits</h2>

          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-md">
              <thead className="bg-gray-100 text-gray-700 text-sm rounded-md">
                <tr>
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Date</th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Doctor</th>
                  <th className="border-b border-gray-300 px-4 py-2 text-left">Diagnosis</th>
                </tr>
              </thead>
              <tbody className="text-gray-800 text-sm">
                <tr className="border-b border-gray-300">
                  <td className="px-4 py-2">Jan 20, 2025</td>
                  <td className="px-4 py-2">Dr. Smith</td>
                  <td className="px-4 py-2">Migraine</td>
                </tr>
                <tr className="bg-gray-50 border-b border-gray-300">
                  <td className="px-4 py-2">Dec 10, 2024</td>
                  <td className="px-4 py-2">Dr. Kim</td>
                  <td className="px-4 py-2">Allergy</td>
                </tr>
                <tr>
                  <td className="px-4 py-2">Nov 5, 2024</td>
                  <td className="px-4 py-2">Dr. Lee</td>
                  <td className="px-4 py-2">Flu</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PatientLayout>

  );
};

export default HomePage;
