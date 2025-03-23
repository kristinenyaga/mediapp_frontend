"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import axios from 'axios'
import TableData from './TableData'
import AppointmentFilters from './AppointmentFilters'
import format from 'date-fns/format'
const Appointments = () => {
  const [appointments, setAppointments] = useState([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    }
  ]);

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "all",
    username: ""
  });

    const handleDateRange = (ranges) => {
      setDateRange([ranges.selection])
      setFilters(prev => ({
        ...prev,
        startDate: format(ranges.selection.startDate,'yyyy-MM-dd'),
        endDate: format(ranges.selection.endDate, 'yyyy-MM-dd'),
      }))
    }
  
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
  const handleClearButton = () => {
    setDateRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      }
    ])
    setFilters((prevFilters) => ({
      ...prevFilters,
      startDate: '',
      endDate: '',
    }));
  }
  return (
    <AdminLayout>
      <div className='w-[90%]'>
        <p className=' mt-2 text-2xl font-medium'>Appointments</p>
        <p className='mb-7 text-gray-500 text-sm'>Overview of all appointments booked</p>
        <AppointmentFilters setShowDatePicker={setShowDatePicker} showDatePicker={showDatePicker} handleDateRange={handleDateRange} dateRange={dateRange} handleClearButton={handleClearButton}  filters={filters} setFilters={setFilters} />
        <TableData filters={filters} setAppointments={setAppointments} appointments={appointments} columns={columns} />
      </div>
    </AdminLayout>
  )
}

export default Appointments