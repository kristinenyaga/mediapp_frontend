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
    const fetchAppointments = async () => {
      const response = await axios.get('http://localhost:5000/api/appointment')
      setAppointments(response.data)
    }
    fetchAppointments()
  }, [])

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'startTime', label: 'Appointment Time' },
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
        <TableData filters={filters} setAppointments={setAppointments} appointments={appointments} columns={columns} />
      </div>
    </AdminLayout>
  )
}

export default Appointments