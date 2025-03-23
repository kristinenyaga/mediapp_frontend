"use client"
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import api from '@/app/utils/axiosInstance';
import { useRole } from '@/app/context/RoleContext';
import DoctorCard from './DoctorCard';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const { role } = useRole();
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const response = await api.get("/api/doctor", {
          _role: role
        });
        setDoctors(response.data);
        setFilteredDoctors(response.data); // Default to all doctors
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAllDoctors();
  }, [role]);

  // Filtering Logic
  useEffect(() => {
    let filtered = doctors;
    if (specializationFilter) {
      filtered = filtered.filter(doctor => doctor.specialization.toLowerCase().includes(specializationFilter.toLowerCase()));
    }
    if (experienceFilter) {
      filtered = filtered.filter(doctor => parseInt(doctor.yearsOfExperience) >= parseInt(experienceFilter));
    }
    setFilteredDoctors(filtered);
  }, [specializationFilter, experienceFilter, doctors]);

const specializationOptions = [...new Set(doctors.map(doc => doc.specialization))]
  .filter(spec => spec)
  .sort(); 


  return (
    <PatientLayout>
      <p className="text-3xl font-medium text-blue-700">Doctors</p>
      <p className="text-gray-500 text-base mt-1">Find the right doctor and book your appointment.</p>

      {/* Filters Section */}
      <div className="flex flex-wrap gap-4 my-6">
        <select
          className="p-3 border border-gray-300 text-gray-700 bg-white outline-none rounded-md w-64"
          value={specializationFilter}
          onChange={(e) => setSpecializationFilter(e.target.value)}
        >
          <option value="">All Specializations</option>
          {specializationOptions.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>

        <select
          className="p-3 border border-gray-300 text-gray-700 bg-white outline-none rounded-md w-64"
          value={experienceFilter}
          onChange={(e) => setExperienceFilter(e.target.value)}
        >
          <option value="">Any Experience</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 mt-6 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%]">
        {filteredDoctors?.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onSelect={() => setSelectedDoctor(doctor)} // Pass full doctor data for modal
          />
        ))}
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-lg">
            {/* Doctor Name & Specialization */}
            <h2 className="text-2xl font-semibold text-gray-700">{selectedDoctor.username || "N/A"}</h2>
            <p className="text-lg text-blue-700">{selectedDoctor.specialization || "General Practitioner"}</p>

            {/* Experience & Contact */}
            <p className="text-sm mt-2 text-gray-600">
              <strong>Experience:</strong> {selectedDoctor.yearsOfExperience || "N/A"} years
            </p>
            <p className="text-sm mt-2 text-gray-600">
              <strong>Room Number:</strong> {selectedDoctor.room_number || "N/A"}
            </p>

            {/* Working Days & Hours */}
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-700">Working Hours</h3>
              <ul className="text-sm text-gray-600 mt-2 space-y-2">
                {selectedDoctor.workinghours
                  ?.sort((a, b) => new Date(`2025-01-01 ${a.startTime}`) - new Date(`2025-01-01 ${b.startTime}`)) // Sort by start time
                  .map((schedule, index) => (
                    <li key={index} className="flex justify-between">
                      <span className="font-medium">{schedule.dayOfWeek}:</span>
                      <span>
                        {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Active Status */}
            <p className={`text-sm mt-4 ${selectedDoctor.status === "active" ? "text-brand-600" : "text-red-600"}`}>
              <strong>Status:</strong> {selectedDoctor.status.charAt(0).toUpperCase() + selectedDoctor.status.slice(1)}
            </p>

            {/* Close Button */}
            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                onClick={() => setSelectedDoctor(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </PatientLayout>
  );
};

export default Doctors;
