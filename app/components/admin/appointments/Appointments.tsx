"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import axios from 'axios'
import TableData from './TableData'
import AppointmentFilters from './AppointmentFilters'
const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "all",
    username: ""
  });
  
  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get('http://localhost:5000/api/appointment')
      setAppointments(response.data)
    }
    fetchPatients()
  }, [])

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'status', label: 'Status' },
    { key: 'patient', label: 'Patient' },
    { key: 'doctor', label: 'Doctor' }

  ]

  return (
    <AdminLayout>
      <div className='w-[90%]'>
        <p className=' mt-2 text-2xl font-medium'>Appointments</p>
        <p className='mb-7 text-gray-500 text-sm'>Overview of all appointments booked</p>
        <AppointmentFilters filters={filters} setFilters={setFilters} />
        <TableData filters={filters} data={appointments} columns={columns} />
      </div>
    </AdminLayout>
  )
}

export default Appointments