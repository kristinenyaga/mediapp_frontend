import React, { useState } from "react";

const PatientFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: "active",
    gender: "",
    ageRange: [0, 100],
    lastVisit: "",
  });

  const handleChange = (key, value) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters); // Pass updated filters to the parent component
  };

  return (
    <div className="bg-white rounded-lg flex flex-wrap gap-6 items-center mt-5">
      {/* Status Filter */}
      <div className="flex flex-col">
        <label className="text-sm mb-2 text-gray-600">Status</label>
        <select className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" onChange={(e) => handleChange("status", e.target.value)}>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

      </div>

      {/* Gender Filter */}
      <div className="flex flex-col">
        <label className="text-sm mb-2 text-gray-600">Sex</label>
        <select onChange={(e) => handleChange("gender", e.target.value)} className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500">
          <option value="">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </div>


      {/* Age Range Filter */}
      {/* <input
        type="number"
        placeholder="Min Age"
        className="border p-2 rounded w-20"
        onChange={(e) => handleChange("ageRange", [Number(e.target.value), filters.ageRange[1]])}
      />
      <input
        type="number"
        placeholder="Max Age"
        className="border p-2 rounded w-20"
        onChange={(e) => handleChange("ageRange", [filters.ageRange[0], Number(e.target.value)])}
      /> */}

    </div>
  );
};

export default PatientFilters;
