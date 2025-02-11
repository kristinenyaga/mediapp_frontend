"use client"
import React from 'react'
import AdminLayout from '../AdminLayout'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid } from "recharts";
const Home = () => {
  const stats = [
    { title: "Total Patients", value: 1500, bgColor: "rgb(0,150, 199, 10%)", textColor: "#0077B6" },
    { title: "Total Doctors", value: 45, bgColor: "#12b76a12", textColor: "#12B76A" },
    { title: "Total Appointments", value: 5000, bgColor: "#f7900912", textColor: "#F79009" },
    { title: "Appointments Today", value: 30, bgColor: "#6941C612", textColor: "#6941C6" },
    { title: "Canceled Appointments", value: 120, bgColor: "#F0443812", textColor: "#F04438" },
    { title: "Pending Appointments", value: 50, bgColor: "#EAAA0812", textColor: "#EAAA08" }
  ];

  const appointmentTrends = [
    { month: "Jan", appointments: 500 },
    { month: "Feb", appointments: 450 },
    { month: "Mar", appointments: 600 },
    { month: "Apr", appointments: 700 },
    { month: "May", appointments: 800 },
  ];

  const appointmentByDoctor = [
    { name: "Dr. Smith", count: 320 },
    { name: "Dr. Jane", count: 290 },
    { name: "Dr. John", count: 270 },
    { name: "Dr. Emily", count: 250 },
  ];

  const patientDemographics = [
    { name: "18-25 years", value: 400 },
    { name: "26-35 years", value: 600 },
    { name: "36-50 years", value: 500 },
    { name: "51+ years", value: 300 },
  ];

  const completedVsCanceled = [
    { name: "Completed", value: 4800 },
    { name: "Canceled", value: 200 },
  ];

  const mostCommonDiagnoses = [
    { name: "Flu", count: 300 },
    { name: "Diabetes", count: 250 },
    { name: "Hypertension", count: 230 },
    { name: "COVID-19", count: 200 },
    { name: "Asthma", count: 190 },
  ];

  const COLORS = ["#0077B6", "#00C49F", "#FFBB28", "#FF8042"];
  return (
    <AdminLayout>
      <div className="w-[90%]">
        {/* Top Stats */}
        <p className=' mt-2 text-xl font-medium'>Welcome, Back!</p>
        <p className='mb-7 text-gray-500 text-sm'>Overview of the system stats</p>
        <div className="grid grid-cols-3 gap-6 mb-8">
          {stats.map((stat,index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-2 gap-6 mt-5">
          <GraphCard title="Appointment Trends Over Time">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={appointmentTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#6B4DE6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>

          <GraphCard title="Appointment Distribution by Doctor">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={appointmentByDoctor}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6B4DE6" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard>

          <GraphCard title="Patient Age Distribution">
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
          </GraphCard>
        </div>
      </div>
    </AdminLayout>
  )
}

const StatCard = ({ title, value,bgColor,textColor }) => (
  <div className={`bg-white p-6 shadow rounded-md text-center`} style={{backgroundColor:bgColor,color:textColor}}>
    <h3 className="text-black text-base">{title}</h3>
    <p className="text-2xl font-medium mt-2">{value}</p>
  </div>
);

const GraphCard = ({ title, children }) => (
  <div className="bg-white rounded-md">
    <h3 className="text-black text-base mb-5">{title}</h3>
    {children}
  </div>
);

export default Home