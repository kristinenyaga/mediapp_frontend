"use client"
import React, { useEffect, useState } from 'react'
import DoctorLayout from '../doctorLayout'
import LoadingScreen from '../../loader/Loader'
import api from '@/app/utils/axiosInstance'
import TableData from './TableData'

const Patients = () => {
  const [loading, setIsLoading] = useState(false)
  const [patients, setPatients] = useState([])
  const [filters, setFilters] = useState({
    search: "",
    gender: "",
    hasAppointments: false,
    startDate: "",
    endDate: "",
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
        setPatients(getUniquePatients(response.data))
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAppointments()
  }, [])

  const patientsColumns = [
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "age", label: "Age" },
    { key: "gender", label: "Sex" },
    { key: "appointments", label: "Appointments" },
    { key: "createdAt", label: "Registered" }

  ];

  if(loading) return <LoadingScreen/>
  return (
    <DoctorLayout>
      <div className='w-[90%]'>
        <div className="border-b pb-4 mb-6 flex gap-10 items-center">
          <div>
            <h2 className="text-3xl font-medium text-blue-700">Patients</h2>
            <p className="text-gray-500 text-base">Here are all your patients</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          {/* Search Input */}
          <input
            type="text"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="border border-gray-300 py-3 px-4 rounded-md text-base placeholder:text-gray-800 outline-none w-64"
          />

          {/* Gender Filter */}
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className="border bg-white text-base text-gray-800 border-gray-300 py-3 px-4 rounded-md outline-none"
          >
            <option value="">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          {/* Has Appointments */}
          <label className="flex items-center text-base gap-2 text-gray-800">
            <input
              type="checkbox"
              checked={filters.hasAppointments}
              onChange={(e) => setFilters({ ...filters, hasAppointments: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            Has Appointments
          </label>

          {/* Registration Date Range */}
          <fieldset className="flex items-center gap-2 border border-gray-300 p-2 px-4 rounded-md">
            <legend className="text-base text-gray-800 px-2">Registered Between</legend>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="border border-gray-300 p-2 rounded-md text-base bg-white text-gray-700 outline-none"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="border border-gray-300 p-2 rounded-md text-base bg-white text-gray-700 outline-none"
            />
          </fieldset>
        </div>


        <TableData filters={ filters} columns={patientsColumns} data={patients} />
      </div>
    </DoctorLayout>
  )
}

export default Patients