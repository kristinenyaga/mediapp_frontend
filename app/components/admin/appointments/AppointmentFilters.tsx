"use client"
import React, { useEffect, useState } from 'react'

const AppointmentFilters = ({filters,setFilters}) => {

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]:value
    }))
  }
  return (
    <div className='flex pl-2 gap-5 items-center'>
      <div className='flex flex-col'>
        <label className="text-sm mb-2 text-gray-500">Status</label>
        <select name="status" className="border bg-white border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none text-gray-500" onChange={handleFilterChange} value={filters.status}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="canceled">Canceled</option>
        </select>

      </div>
      <div className='flex flex-col'>
        <label className="text-sm mb-2 text-gray-500">Date From</label>
        <input type="date" name="dateFrom" className="border bg-white border-gray-300 px-3 py-2.5 rounded placeholder:text-sm text-gray-500 text-sm" onChange={handleFilterChange} value={filters.dateFrom} />
      </div>
      <div className='flex flex-col'>
        <label className="text-sm mb-2 text-gray-500">Date To</label>
        <input type="date" name="dateTo" className="border bg-white border-gray-300 px-3 py-2.5 rounded  placeholder:text-sm text-gray-500 text-sm" onChange={handleFilterChange} value={filters.dateTo} />
      </div>
      <input
        name="username"
        type="name"
        className={`w-full mt-7 border border-gray-300 py-3 rounded-md px-3 text-sm focus: outline-[#DFE1E0] placeholder:text-gray-500`}
        placeholder="search by patient or doctor name"
        onChange={handleFilterChange} value={filters.username}
      />

    </div>
  )
}

export default AppointmentFilters