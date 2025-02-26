"use client"
import React, { useEffect, useState } from 'react'
import DoctorLayout from '../doctorLayout'
import LoadingScreen from '../../loader/Loader'
import api from '@/app/utils/axiosInstance'
import TableData from './TableData'
import { format } from 'date-fns'
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const Appointments = () => {
  const [loading, setIsLoading] = useState(false)
  const [appointments,setAppointments] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  ]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    startDate: '',
    endDate: '',
    sex:''
  });


  function getUniquePatients(appointments) {
    const uniquePatients = new Map();

    appointments.forEach(appointment => {
      uniquePatients.set(appointment.patient.id, appointment.patient);
    });

    const uniquePatientsArray = [...uniquePatients.values()];
    return uniquePatientsArray

  }
  useEffect(() => {
    setIsLoading(true)
    const fetchAppointments = async () => {
      try {
        const response = await api.get('http://localhost:5000/api/appointment/doctor-appointments')
        setAppointments(response.data)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAppointments()
  }, [])

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'status', label: 'Status' },
    { key: 'patient', label: 'Patient' },
    { key: 'sex', label: 'Sex' },

  ]
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  const handleDateRange = (ranges) => {
    setDateRange([ranges.selection])
    setFilters(prev => ({
      ...prev,
      startDate: format(ranges.selection.startDate,'yyyy-MM-dd'),
      endDate: format(ranges.selection.endDate, 'yyyy-MM-dd'),
    }))
  }
  if (loading) return <LoadingScreen />
  return (
    <DoctorLayout>
      <div className='w-[90%]'>
        <div className="border-b pb-4 mb-6 flex flex-col gap-3">
          <div>
            <h2 className="text-2xl font-medium text-blue-700">Appointments</h2>
            <p className="text-gray-700 text-sm">Here are all your appointments</p>
          </div>
          <div className='flex items-center gap-5 text-gray-700'>
            <p>Appointments for</p>
            <p className='border p-3 border-gray-200 rounded-md text-blue-700'>            {filters.startDate && filters.endDate
              ? `${filters.startDate} - ${filters.endDate}`
              : new Date().toISOString().split('T')[0]}</p>
          </div>
        </div>
        <div className="mb-4 flex gap-4">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="border text-sm p-2 rounded-md bg-blue-600 text-white"
          >
            select date range
          </button>
          {showDatePicker && (
            <div className="absolute z-10 bg-white shadow-lg rounded-md p-4 top-12">
              <DateRange
                ranges={dateRange}
                onChange={handleDateRange}
                moveRangeOnFirstSelection={false}
                rangeColors={["#3b82f6"]}
              />
              <button
                className="mt-2 w-full text-center text-blue-600"
                onClick={() => setShowDatePicker(false)}
              >
                Close
              </button>
            </div>
          )}
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="Search by patient name"
            className="border p-2 rounded-md placeholder:text-sm placeholder:text-gray-700 outline-none focus:border-gray-300"
          />
          <select name="status" value={filters.status} onChange={handleFilterChange} className="border bg-white text-sm text-gray-700 p-2 rounded-md outline-none focus:border-gray-300">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="canceled">Canceled</option>
          </select>
          <select name="sex" value={filters.sex} onChange={handleFilterChange} className="border bg-white text-sm text-gray-700 p-2 rounded-md outline-none focus:border-gray-300">
            <option value="">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>
        </div>
        <TableData columns={columns} data={appointments} filters={filters} />
      </div>
    </DoctorLayout>
  )
}

export default Appointments