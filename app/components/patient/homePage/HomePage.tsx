import React from 'react';
import PatientLayout from '../patientLayout';

const HomePage = () => {
  return (
    <PatientLayout>
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <p className="text-xl font-medium text-gray-900">
              Welcome Back, <span className="text-blue-600">Kristine</span>
            </p>
            <p className="text-sm text-gray-500">Here’s your current status and updates</p>
          </div>
          <div className="flex items-center gap-4 mr-10">
            <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center text-white text-lg font-bold">
              K
            </div>
            <p className="text-gray-800 font-medium">Kristine</p>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Queue Information */}
          <div>
            <p className="text-blue-600 text-[18px] font-medium">Queue Information</p>
            <div className="bg-white shadow-sm rounded-lg py-4 px-2">
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-gray-900 font-medium">Your Queue Number: <span className="text-blue-600">#10</span></p>
                <p className="text-gray-900 font-medium">Current Queue Position: <span className="text-red-500">#1</span></p>
                <p className="text-sm text-gray-500 mt-1">9 people ahead</p>
              </div>
            </div>
          </div>


          {/* Next Appointment */}
          <div>
            <p className="text-blue-600 text-[18px] font-medium">Upcoming Appointment</p>
            <div className=" shadow-sm rounded-lg py-4 px-2 bg-white">
              <div className="mt-2 flex flex-col gap-2">
                <p className="text-gray-700">Date: <span className="">20th Jan 2025</span></p>
                <p className="text-gray-700">Time: 10:30 AM</p>
                <p className="text-gray-700">Room: 305</p>
              </div>
            </div>
          </div>

        </div>

        {/* Notifications Section */}
        <div className="mt-8">
          <p className="text-blue-600 text-lg font-medium">Notifications</p>
          <div className="bg-white shadow-sm rounded-lg py-4 px-2 mt-4">
            <ul className="divide-y divide-gray-200">
              <li className="py-2">
                <p className="text-gray-900 font-medium">Reminder: Appointment with Dr. Smith</p>
                <p className="text-sm text-gray-500">Scheduled for 20th Jan 2025 at 10:30 AM</p>
              </li>
            </ul>
          </div>
        </div>
        {/* Health Summary Section */}
        <div className="mt-8">
          <p className="text-blue-600 text-lg font-medium">Health Summary</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="bg-white shadow-sm rounded-lg py-4 px-2">
              <p className="text-gray-600 font-medium">Total Appointments</p>
              <p className="text-blue-600 text-3xl font-bold ">12</p>
              <p className="text-sm text-gray-500 mt-1">Since 2024</p>
            </div>

            <div className="bg-white shadow-sm rounded-lg py-4 px-2">
              <p className="text-gray-600 font-medium">Upcoming Appointments</p>
              <p className="text-blue-600 text-3xl font-bold">1</p>
              <p className="text-sm text-gray-500 mt-1">Scheduled for today</p>
            </div>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default HomePage;