import React from "react";

const AppointmentsFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  console.log('filters',filters)

  return (
    <div className="flex gap-4 mb-4">
      <input type="date" name="dateFrom" onChange={handleChange} className="border bg-white border-gray-300 p-2 rounded placeholder:text-sm text-gray-500 text-sm" />
      <input type="date" name="dateTo" onChange={handleChange} className="border bg-white border-gray-300 p-2 rounded  placeholder:text-sm text-gray-500 text-sm" />
      <select name="status" onChange={handleChange} className="border bg-white border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500">
        <option value="">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
        <option value="canceled">Canceled</option>
      </select>
      <input type="text" name="patientName" placeholder="Patient Name" onChange={handleChange} className="border bg-white border-gray-300 placeholder:text-sm placeholder:text-gray-500 text-gray-500 text-sm p-2 rounded" />
    </div>
  );
};

export default AppointmentsFilters;
