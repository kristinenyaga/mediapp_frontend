"use client"
import React, { useEffect } from 'react'
import AdminLayout from '../AdminLayout'
import axios from 'axios'
import { useParams } from 'next/navigation'
const AppointmentDetails = () => {
  const { id } = useParams()
  
  useEffect(() => {
    const fetchAppointment = async () => {
      const response = await axios.get(`http://localhost:5000/api/appointment/${id}`)
    }
    fetchAppointment()
  },[])
  return (
    <AdminLayout>
      hey
    </AdminLayout>
  )
}

export default AppointmentDetails