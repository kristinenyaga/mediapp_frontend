import React from "react";
import { FiCalendar, FiBell, FiCheckCircle } from "react-icons/fi";
import PatientLayout from "../patientLayout";

const HomePage = () => {
  return (
    <PatientLayout>
      <div className="py-2 space-y-8 w-[90%] relative">
        {/* Header */}
        <header className="flex justify-between items-center pb-6">
          <div>
            <h1 className="text-xl font-medium text-blue-700">
              Welcome Back, Kristine 👋
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Stay on top of your health journey.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex justify-center items-center text-white text-lg font-bold">
              K
            </div>
            <p className="text-gray-800 font-medium">Kristine</p>
          </div>
        </header>

        {/* Overview Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Queue Information */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-medium mb-3">
              Queue Information
            </h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-800">
                <span className="font-medium">Queue Number:</span>{" "}
                <span className="text-blue-600">#10</span>
              </p>
              <p className="text-gray-800">
                <span className="font-medium">Current Position:</span>{" "}
                <span className="text-red-600">#1</span>
              </p>
              <p className="text-sm text-gray-500">9 people ahead of you</p>
            </div>
          </div>

          {/* Next Appointment */}
          <div className="bg-green-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium text-green-600 mb-3">
              Upcoming Appointment
            </h2>
            <p className="text-gray-800 text-sm">
              <span className="font-medium">Date:</span> 20th Jan 2025
            </p>
            <p className="text-gray-800 mt-1 text-sm">
              <span className="font-medium">Time:</span> 10:30 AM
            </p>
            <p className="text-gray-800 mt-1 text-sm">
              <span className="font-medium">Room:</span> 305
            </p>
          </div>

          {/* Book Appointment */}
          <div className="bg-yellow-50 p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-medium text-yellow-600 mb-3">
              Need a New Appointment?
            </h2>
            <p className="text-gray-800 text-sm">Check available slots and book instantly.</p>
            <button className="mt-4 text-sm bg-yellow-600 text-white py-2 px-6 rounded-lg flex items-center gap-2">
              <FiCalendar /> Book Now
            </button>
          </div>
        </section>

        {/* Notifications Section */}
        <section>
          <h2 className="text-lg font-medium text-blue-600 mb-4 flex items-center gap-2">
            <FiBell /> Notifications
          </h2>
          <div className="bg-white shadow-sm rounded-xl p-4">
            <ul className="space-y-4">
              <li>
                <p className="text-gray-800 font-medium">
                  Reminder: Appointment with Dr. Smith
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Scheduled for 20th Jan 2025 at 10:30 AM
                </p>
              </li>
            </ul>
          </div>
        </section>

        {/* Quick Health Stats */}
        <section>
          <h2 className="text-lg font-medium text-blue-600 mb-4 flex items-center gap-2">
            <FiCheckCircle /> Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-50 p-6 rounded-xl shadow-sm">
              <p className="text-gray-700">Appointments Completed</p>
              <p className="text-green-600 text-3xl font-bold">12</p>
              <p className="text-sm text-gray-500 mt-1">Since 2024</p>
            </div>
            <div className=" p-6 rounded-xl shadow-sm">
              <p className="text-gray-700">Upcoming Appointments</p>
              <p className="text-yellow-600 text-3xl font-bold">1</p>
              <p className="text-sm text-gray-500 mt-1">Today</p>
            </div>
          </div>
        </section>

        {/* Health Tips */}
        <section>
          <div className="text-center mt-10">
            <p className="text-gray-300 font-medium text-2xl">"An apple a day keeps the doctor away!"</p>
          </div>
        </section>
      </div>
    </PatientLayout>
  );
};

export default HomePage;
