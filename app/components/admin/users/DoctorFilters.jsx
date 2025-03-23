import React, { useEffect, useState } from "react";

const DoctorFilters = ({onFilterChange,doctors}) => {

  const [filters, setFilters] = useState({
    specialization: "",
    status: "",
    yearsOfExperience: "",
    room_number: "",
  });

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const specializationOptions = [...new Set(doctors.map(doc => doc.specialization))]
  .filter(spec => spec)
  .sort(); 

  return (
    <div className="bg-white rounded-lg flex flex-wrap gap-6 items-center mt-5">
      {/* Specialization Filter */}
      <div className="flex flex-col">
        <label className="text-base mb-2 text-gray-700">Specialization</label>
        <select
          className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.specialization}
          onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
        
        >
          <option value="">All Specializations</option>
          {specializationOptions.map((spec, index) => (
            <option key={index} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>


      {/* Years of Experience Filter */}
      <div className="flex flex-col">
        <label className="text-base mb-2 text-gray-700">Years of Experience</label>
        <select
          className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.yearsOfExperience}
          onChange={(e) => setFilters(prev => ({ ...prev, yearsOfExperience: e.target.value }))}
        >
          <option value="">All</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
          <option value="15">15+ years</option>
        </select>
      </div>

      {/* Room Number Filter */}
      <div className="flex flex-col">
        <label className="text-base mb-2 text-gray-700">Room Number</label>
        <input
          type="number"
          className="border border-gray-400 rounded-md px-3 py-2 text-base focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter room number"
          value={filters.room_number}
          onChange={(e) => setFilters(prev => ({ ...prev, room_number: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default DoctorFilters;
