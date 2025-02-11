"use client";
import React, { useEffect, useState } from "react";
import Navbar from "./landingPage/Navbar";
import Image from "next/image";
import axios from "axios";
import { doctorImage } from "@/public/constants/images";
import { useRouter } from "next/navigation";
const AvailableDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filter, setFilter] = useState({ specialization: "", availability: "all" });
  const [sortOption, setSortOption] = useState("experience");
  const router = useRouter()

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    fetchDoctors();
  }, []);

  // Filtering doctors based on selected criteria
  const filteredDoctors = doctors.filter((doctor) => {
    if (filter.specialization && doctor.specialization !== filter.specialization) {
      return false;
    }
    if (filter.availability === "available" && doctor.status !== "active") {
      return false;
    }
    return true;
  });

  // Sorting logic
  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    if (sortOption === "experience") {
      return parseInt(b.yearsOfExperience) - parseInt(a.yearsOfExperience);
    }
    if (sortOption === "name") {
      return a.username.localeCompare(b.username);
    }
    if (sortOption === "availability") {
      return a.status === "active" ? -1 : 1;
    }
    return 0;
  });

  return (
    <div>
      <Navbar />
      <div className="max-w-[1280px] mx-auto px-4">
        {/* Hero Section */}
        <div className="flex justify-between items-center mt-24 relative">
          <div className="">
            <h1 className="text-[48px] font-medium text-gray-900">
              Find the Right <span className="bg-[#6c4de612] px-2 rounded-lg">Doctor</span>
            </h1>
            <p className="mt-5 w-3/4 text-gray-500">
              Browse our list of certified doctors and book an appointment in just a few clicks.
            </p>
          </div>
          <div className="absolute left-[65%] top-[30%] bg-[#6c4de612] text-secondary p-3 rounded-[8px]">
            ✅ Verified & Certified
          </div>
          <Image src={doctorImage} alt="doctor image" />
        </div>

        {/* Filters & Sorting */}
        <div className="flex items-center gap-4 mt-20">
          <select
            className="p-2 bg-white border border-gray-300 rounded-md text-sm px-3 focus:outline-none"
            value={filter.specialization}
            onChange={(e) => setFilter({ ...filter, specialization: e.target.value })}
          >
            <option value="">All Specializations</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Pediatrician">Pediatrician</option>
          </select>

          <select
            className="p-2 bg-white border border-gray-300 rounded-md text-sm px-3 focus:outline-none"
            value={filter.availability}
            onChange={(e) => setFilter({ ...filter, availability: e.target.value })}
          >
            <option value="all">All Doctors</option>
            <option value="available">Available Now</option>
          </select>

          <select
            className="p-2 bg-white border border-gray-300 rounded-md text-sm px-3 focus:outline-none"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="experience">Sort by Experience</option>
            <option value="name">Sort by Name</option>
            <option value="availability">Sort by Availability</option>
          </select>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {sortedDoctors.map((doctor) => (
            <div
              key={doctor.id}
              className="p-6 bg-white border border-gray-200 rounded-lg hover:scale-105 transition-all duration-300 relative flex flex-col items-start"
            >
              {/* Doctor Info Section */}
              <div className="flex items-center gap-4 w-full">
                <div className="w-20 h-20 flex-shrink-0 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-lg font-semibold">
                  {doctor.username.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{doctor.username}</h3>
                  <p className="text-secondary text-sm">{doctor.specialization || "General Practitioner"}</p>
                  <p className="text-gray-600 text-xs mt-1">{doctor.yearsOfExperience} years experience</p>
                </div>
              </div>

              {/* Room & Working Days Section */}
              <div className="mt-4 p-3 rounded-md w-full">
                <p className="text-sm text-gray-700 flex items-center gap-2">
                  🏥 <span className="font-medium">Room:</span>
                  <span className="text-gray-700">{doctor.room_number}</span>
                </p>
                <p className="text-sm text-gray-700 flex items-center gap-2 mt-2">
                  📅 <span className="font-medium">Working Days:</span>
                  <span className="text-gray-700">{doctor.workinghours.map((day) => day.dayOfWeek).join(", ")}</span>
                </p>
              </div>

              {/* Availability Status */}
              <div
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-medium rounded-md ${doctor.status === "active" ? "bg-brand-100 text-brand-400" : "bg-red-100 text-red-700"
                  }`}
              >
                {doctor.status === "active" ? "Available" : "Unavailable"}
              </div>
              <button onClick={()=>router.push('/sign-in')} className="mt-5 text-secondary px-5 text-sm py-3 rounded-md bg-[#6c4de61e]">book appointment</button>
            </div>

          ))}
        </div>
      </div>
    </div>
  );
};

export default AvailableDoctors;
