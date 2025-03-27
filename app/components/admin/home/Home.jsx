"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import axios from 'axios';
const Home = () => {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments,setAppointments] = useState([])
  const [filter, setFilter] = useState('thisMonth');
  const [filterTwo, setFilterTwo] = useState('thisMonth');

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = [2024, 2025]

  const appointmentsToday = () => {
    const today = new Date()
    const todayDateString = today.toISOString().split("T")[0]
    const todayAppointments = appointments.reduce((acc, item) => {
      const appointmentDateString = new Date(item.date).toISOString().split('T')[0];

      if (todayDateString === appointmentDateString) {
        return acc + 1
      }
      return acc
    }, 0)
    return todayAppointments
  }

  // const pendingAppointments = appointments.filter(appointment => appointment.status === 'pending')
  const cancelledAppointments = appointments.filter(appointment => appointment.status === 'cancelled')
  const completedAppointments=appointments.filter(appointment => appointment.status === 'completed')


  const stats = [
    { title: "Total Patients", value: patients?.length, bgColor: "rgb(0,150, 199, 10%)", textColor: "#0077B6" },
    { title: "Total Doctors", value: doctors?.length, bgColor: "#12b76a12", textColor: "#12B76A" },
    { title: "Total Appointments", value: appointments?.length, bgColor: "#f7900912", textColor: "#F79009" },
    { title: "Appointments Today", value: appointmentsToday(), bgColor: "#6941C612", textColor: "#6941C6" },
    { title: "Canceled Appointments", value: cancelledAppointments.length, bgColor: "#F0443812", textColor: "#F04438" },
    { title: "Completed Appointments", value:completedAppointments.length, bgColor: "#E7F4DC", textColor: "#76AB35" }
  ];

  // const patientDemographics = [
  //   { name: "18-25 years", value: 4 },
  //   { name: "26-35 years", value: 3 },
  //   { name: "36-50 years", value: 2},
  //   { name: "51+ years", value: 0 },
  // ];

  // const completedVsCanceled = [
  //   { name: "Completed", value: 12 },
  //   { name: "Canceled", value: 4 },
  // ];

  // const mostCommonDiagnoses = [
  //   { name: "Flu", count: 300 },
  //   { name: "Diabetes", count: 250 },
  //   { name: "Hypertension", count: 230 },
  //   { name: "COVID-19", count: 200 },
  //   { name: "Asthma", count: 190 },
  // ];
  const getFilteredData = () => {
    let filteredData = []
    
    if (filter === 'thisWeek') {
      const startOfWeek = new Date()
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
      
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)
      
      const weeklyAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >=startOfWeek && appointmentDate<=endOfWeek
      })

      const groupedData = {}

      weeklyAppointments.forEach(appointment => {
        const day = new Date(appointment.date).getDay()
        groupedData[day] = (groupedData[day] || 0) + 1
        
      })
      filteredData = Object.keys(groupedData).map(day => ({
        day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][day],
        appointments:groupedData[day]
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
        groupedData[month] = (groupedData[month] || 0)+1
      })

      filteredData = Object.keys(groupedData).map(month => ({
        day:month,
        appointments:groupedData[month]
      }))
    }
    return filteredData
  }
  const getFilteredAppointmentByDoctor = () => {
    let filteredAppointments = []

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    if (filterTwo === 'today') {
      filteredAppointments=appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate.toDateString === today.toDateString()
      })
    }
    if (filterTwo === 'thisWeek') {
      filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek
      })
    }
    if (filterTwo === 'thisMonth') {
      filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate.getMonth() === currentMonth && appointmentDate.getFullYear() === currentYear
      })
    }
    if (filterTwo === 'otherMonths') {
      filteredAppointments = appointments.filter(appointment => {
        const appointmentDate = new Date(appointment.date)
        return appointmentDate.getMonth() === Number(selectedMonth) && appointmentDate.getFullYear() === Number(selectedYear)
      })
    }

    const groupedData = {};

    filteredAppointments.forEach(appointment => {
      const doctorName = appointment.doctor.username;
      groupedData[doctorName] = (groupedData[doctorName] || 0) + 1;
    });

    return Object.keys(groupedData).map(doctor => ({
      name:doctor,
      count:groupedData[doctor]
    }))
  }
  const filteredData = getFilteredData()
  const doctorFilteredData = getFilteredAppointmentByDoctor()
  // const COLORS = ["#0077B6", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get('http://localhost:5000/api/patient')
      setPatients(response.data)
    }
    const fetchDoctors = async () => {
      const response = await axios.get('http://localhost:5000/api/doctor')
      setDoctors(response.data)
    }
    const fetchAppointments = async () => {
      const response = await axios.get('http://localhost:5000/api/appointment')
      setAppointments(response.data)
    }
    fetchAppointments()
    fetchDoctors()
    fetchPatients()
  },[])
  return (
    <AdminLayout>
      <div className="w-[90%]">
        <p className=' mt-2 text-2xl font-medium'>Welcome, Back!</p>
        <p className='mb-7 text-gray-500 text-base'>Overview of the system stats</p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat,index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-6 mt-5">
          <GraphCard title="Appointment Trends Over Time">
            <select className='bg-white py-2 mb-4 border border-gray-400 rounded-md focus:outline-none' value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="thisWeek">This Week</option>
              <option value="thisMonth">This Month</option>
              <option value="otherMonths">Other Months</option>
            </select>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={filteredData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#6B4DE6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>

          <GraphCard title="Appointment Distribution by Doctor">
            <div className='flex gap-2 items-center'>
              <select className='bg-white py-2 mb-4 border border-gray-400 rounded-md focus:outline-none' value={filterTwo} onChange={(e) => setFilterTwo(e.target.value)}>
                <option value="today">Today</option>
                <option value="thisWeek">This Week</option>
                <option value="thisMonth">This Month</option>
                <option value="otherMonths">Other Months</option>
              </select>

              {filterTwo === 'otherMonths' && (
                <div className='flex items-center gap-3 mb-4'>
                  <select className='bg-white py-2 border border-gray-400 rounded-md focus:outline-none' value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                    {months.map((month, index) => (
                      <option key={index} value={index}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <select className='bg-white py-2 border border-gray-400 rounded-md focus:outline-none' value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>


            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={doctorFilteredData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6B4DE6" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard>

          {/* <GraphCard title="Patient Age Distribution">
            <ResponsiveContainer width="100%" height={350}>
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

          <GraphCard title="Completed vs Canceled Appointments">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Tooltip formatter={(value, name) => [`${value} Appointments`, name]} />
                <Pie
                  data={completedVsCanceled}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  <Cell fill="#00C49F" name="Completed" />
                  <Cell fill="#ED2B2A" name="Canceled" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </GraphCard>


          <GraphCard title="Most Common Diagnoses">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mostCommonDiagnoses}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard> */}
        </div>
      </div>
    </AdminLayout>
  )
}

const StatCard = ({ title, value,bgColor,textColor }) => (
  <div className={`bg-white p-6 rounded-md text-center`} style={{backgroundColor:bgColor,color:textColor}}>
    <h3 className="text-black text-base">{title}</h3>
    <p className="text-2xl font-medium mt-2">{value}</p>
  </div>
);

const GraphCard = ({ title, children }) => (
  <div className="bg-white rounded-md">
    <h3 className="text-black text-base mb-3">{title}</h3>
    {children}
  </div>
);

export default Home