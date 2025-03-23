"use client"
import React from 'react'
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { RiCloseFill } from 'react-icons/ri';

const AppointmentFilters = ({ filters, setFilters, showDatePicker, setShowDatePicker, handleClearButton,dateRange,handleDateRange }) => {

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]:value
    }))
  }
  return (
    <div>
      <div className='flex items-center gap-5 text-gray-700'>
        <p>All Appointments for</p>
        <p className='border p-3 border-gray-200 rounded-md text-blue-700'>
          {filters.startDate && filters.endDate
            ? `${filters.startDate} - ${filters.endDate}`
            : new Date().toISOString().split('T')[0]}</p>
      </div>
      <div className='flex pl-2 mt-2 gap-5 items-center'>
        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className=" text-sm p-2.5 w-[200px] mt-7 rounded-md border border-blue-600 text-blue-600"
        >
          select date range
        </button>
        {showDatePicker && (
          <div className="absolute z-10 bg-white shadow-lg rounded-md p-4 top-16">
            <DateRange
              ranges={dateRange}
              onChange={handleDateRange}
              moveRangeOnFirstSelection={false}
              rangeColors={["#3b82f6"]}
            />
            <div className='flex justify-between'>
              <button
                className="mt-2 flex items-center w-full text-center text-red-600"
                onClick={() => setShowDatePicker(false)}
              >
                Close <RiCloseFill className='text-lg' />
              </button>
              <button
                className="mt-2 flex items-center w-full text-center text-blue-700"
                onClick={() => handleClearButton()}
              >
                Clear
              </button>
            </div>

          </div>
        )}
        <div className='flex flex-col'>
          <label className="text-sm mb-2 text-gray-500">Status</label>
          <select name="status" className="border bg-white border-gray-300 rounded-md px-3 py-2.5 text-sm focus:outline-none text-gray-500" onChange={handleFilterChange} value={filters.status}>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="canceled">Canceled</option>
          </select>

        </div>

        {/* <div className='flex flex-col'>
        <label className="text-sm mb-2 text-gray-500">Date From</label>
        <input type="date" name="dateFrom" className="border bg-white border-gray-300 px-3 py-2.5 rounded placeholder:text-sm text-gray-500 text-sm" onChange={handleFilterChange} value={filters.dateFrom} />
      </div>
      <div className='flex flex-col'>
        <label className="text-sm mb-2 text-gray-500">Date To</label>
        <input type="date" name="dateTo" className="border bg-white border-gray-300 px-3 py-2.5 rounded  placeholder:text-sm text-gray-500 text-sm" onChange={handleFilterChange} value={filters.dateTo} />
      </div> */}
        <input
          name="username"
          type="name"
          className={`w-full mt-7 border border-gray-300 py-3 rounded-md px-3 text-sm focus: outline-[#DFE1E0] placeholder:text-gray-500`}
          placeholder="search by patient or doctor name"
          onChange={handleFilterChange} value={filters.username}
        />

      </div>
    </div>

  )
}

export default AppointmentFilters