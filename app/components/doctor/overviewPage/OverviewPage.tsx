"use client"
import React, { useEffect, useState } from 'react'
import DoctorLayout from '../doctorLayout'
import Header from '../Header'
import Image from 'next/image'
import { appointmentBlue, appointmentRed, appointmentGreen } from '@/public/constants/images'
import { FaCalendarCheck, FaUserCheck, FaFileMedicalAlt, FaCalendarTimes, FaCalendarDay, FaUsers, FaChartBar } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import api from '@/app/utils/axiosInstance'
import LoadingScreen from '../../loader/Loader'
const OverviewPage = () => {
  const [appointments,setAppointments] = useState([])
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [filter, setFilter] = useState('thisMonth');
  const [loading, setIsLoading] = useState(false)
  const mostCommonDiagnoses = [
    { name: "Flu", count: 300 },
    { name: "Diabetes", count: 250 },
    { name: "Hypertension", count: 230 },
    { name: "COVID-19", count: 200 },
    { name: "Asthma", count: 190 },
  ];
  const patientDemographics = [
    { name: "18-25 years", value: 400 },
    { name: "26-35 years", value: 600 },
    { name: "36-50 years", value: 500 },
    { name: "51+ years", value: 300 },
  ];
  const COLORS = ["#1d4ed8", "#0077b6", "#6B4DE6", "#2563eb "];


  const getFilteredData = () => {
    let filteredData = []

    if (filter === 'thisWeek') {
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())

      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      const weeklyAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
      })

      const groupedData = {}

      weeklyAppointments.forEach(appointment => {
        const day = new Date(appointment.date).getDay()
        groupedData[day] = (groupedData[day] || 0) + 1

      })
      filteredData = Object.keys(groupedData).map(day => ({
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
        appointments: groupedData[day]
      }))

    }

    else if (filter === "thisMonth") {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()

      const monthlyAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear
      })
      const groupedData = {}

      monthlyAppointments.forEach(appointment => {
        const week = Math.ceil(new Date(appointment.date).getDate() / 7)
        groupedData[week] = (groupedData[week] || 0) + 1
      })
      filteredData = Object.keys(groupedData).map(week => ({
        day: `week ${week}`,
        appointments: groupedData[week]
      }
      ))
    }

    else if (filter === "otherMonths") {
      const groupedData = {}

      appointments.forEach(appointment => {
        const appointmentDate = new Date(appointment.date)
        const month = appointmentDate.toLocaleString('default', { month: 'short' })
        groupedData[month] = (groupedData[month] || 0) + 1
      })

      filteredData = Object.keys(groupedData).map(month => ({
        day: month,
        appointments: groupedData[month]
      }))
    }
    return filteredData
  }
  const getNoShowData = () => {
    const groupedData = {};

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const month = appointmentDate.toLocaleString("default", { month: "short" });

      if (!groupedData[month]) {
        groupedData[month] = { booked: 0, attended: 0 };
      }

      groupedData[month].booked += 1; 
      if (appointment.status === 'completed') {
        groupedData[month].attended += 1; 
      }
    });

    return Object.keys(groupedData).map((month) => ({
      month,
      booked: groupedData[month].booked,
      attended: groupedData[month].attended,
    }));
  };

  const noShowData = getNoShowData();

  const filteredData = getFilteredData()
  
  useEffect(() => {
    setIsLoading(true)
    const fetchAppointments = async () => {
      try {
        const response = await api.get('http://localhost:5000/api/appointment/doctor-appointments')
        setAppointments(response.data)
        const sortedAppointments = response.data
          .sort((a, b) => new Date(a.date) - new Date(b.date)) 
          .slice(0, 5); 

        setUpcomingAppointments(sortedAppointments);
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
    fetchAppointments()
  }, [])
  const formatTime = (timestring) => {
    if (!timestring) return "N/A";
    const [hours, minutes] = timestring.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };
  if(loading) return <LoadingScreen />
  return (
    <DoctorLayout>
      <Header />
      <div className='mt-8'>
        <div className='flex gap-5 justify-between w-[100%] xl:w-[90%] pr-5'>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center'>
              <div className='flex  justify-center items-center rounded-full w-14 h-14 bg-gray-200'>
                <FaCalendarCheck className='text-2xl text-blue-700'/>
              </div>
              <p className='text-blue-700 text-sm font-medium'>Upcoming <br /> Apppointments</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center px-2'>
              <div className='flex justify-center items-center rounded-full w-14 h-14 bg-gray-200'>
                <FaCalendarCheck className='text-2xl text-brand-500' />
              </div>
              <p className=' text-brand-500 text-sm font-medium'>Comleted <br /> Apppointments</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center px-2'>
              <div className='flex justify-center items-center rounded-full w-14 h-14 bg-gray-200'>
                <FaCalendarCheck className='text-2xl text-red-400' />
              </div>
              <p className=' text-red-400 text-sm font-medium'>Cancelled <br /> Apppointments</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center px-2'>
              <div className='flex justify-center items-center rounded-full w-14 h-14 bg-gray-200'>
                <FaUsers className='text-3xl text-blue-300'/>
              </div>
              <p className=' text-blue-300 text-sm font-medium'>Total <br /> Patients</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>
        </div>
        <div className='grid grid-cols-2 w-[90%]'>
          <GraphCard title="Appointment Trends Over Time">
            <select className='bg-white  text-gray-700 mt-2 py-2 mb-4 border border-gray-400 rounded-md focus:outline-none' value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="otherMonths">Other Months</option>
            </select>
            <ResponsiveContainer width="90%" height={250}>
              <LineChart data={filteredData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#6B4DE6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>
          <GraphCard title="Most Common Diagnoses">
            <select className='bg-white  text-gray-700 mt-2 py-2 mb-4 border border-gray-400 rounded-md focus:outline-none' value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="otherMonths">Other Months</option>
            </select>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mostCommonDiagnoses}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6B4DE6" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard>
          <GraphCard title="Patient Age Distribution">
            <ResponsiveContainer width="80%" height={300}>
              <PieChart>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Pie data={patientDemographics} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {patientDemographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </GraphCard>
          <GraphCard title="Appointment No-Show Rate (booked vs attended)">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={noShowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="booked" fill="#6B4DE6" name="Booked" />
                <Bar dataKey="attended" fill="#50C878" name="Attended" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard>

        </div>
        <div className="bg-white w-[90%] rounded-xl p-4">
          <h2 className="text-lg text-gray-700 mb-5">Upcoming Appointments</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-700">
                <th className="p-2">Patient</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map((appt, index) => (
                <tr key={index} className="border-b text-sm text-gray-600">
                  <td className="p-2">{appt.patient.username}</td>
                  <td className="p-2">{new Date(appt.date).toLocaleDateString()}</td>
                  <td className="p-2">{formatTime(appt?.startTime)} - {formatTime(appt?.endTime)}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${appt.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {upcomingAppointments.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No upcoming appointments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </DoctorLayout>
  )
}

const GraphCard = ({ title, children }) => (
  <div className="bg-white rounded-md mt-10">
    <h3 className="text-gray-700 text-lg mb-3">{title}</h3>
    {children}
  </div>
);

export default OverviewPage
