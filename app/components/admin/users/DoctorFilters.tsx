import React, { useEffect, useState } from "react";

const DoctorFilters = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {

  const [filters, setFilters] = useState({
    specialization: "",
    status: "",
    experience: "",
    roomNumber: "",
  });

  // Call onFilterChange when filters change
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);
  return (
    <div className="bg-white rounded-lg flex flex-wrap gap-6 items-center mt-5">
      {/* Specialization Filter */}
      <div className="flex flex-col">
        <label className="text-sm mb-2 text-gray-600">Specialization</label>
        <select
          className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.specialization}
          onChange={(e) => setFilters((prev) => ({ ...prev, specialization: e.target.value }))}
        
        >
          <option value="">All</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="Orthopedics">Orthopedics</option>
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-col">
        <label className="text-sm mb-2 text-gray-600">Status</label>
        <select
          className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          
        >
          <option value="">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Years of Experience Filter */}
      <div className="flex flex-col">
        <label className="text-sm mb-2 text-gray-600">Years of Experience</label>
        <select
          className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={filters.experience}
          onChange={(e) => setFilters(prev => ({ ...prev, experience: e.target.value }))}
        >
          <option value="">All</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
          <option value="15">15+ years</option>
        </select>
      </div>

      {/* Room Number Filter */}
      <div className="flex flex-col">
        <label className="text-sm mb-2 text-gray-600">Room Number</label>
        <input
          type="number"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          placeholder="Enter room number"
          value={filters.roomNumber}
          onChange={(e) => setFilters(prev => ({ ...prev, roomNumber: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default DoctorFilters;
