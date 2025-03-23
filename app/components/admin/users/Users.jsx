"use client"
import React, { useEffect, useState } from 'react'
import AdminLayout from '../AdminLayout'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TableData from './TableData';
import DoctorFilters from './DoctorFilters';
import axios from 'axios';
import PatientFilters from './PatientFilters';
import { useRouter } from 'next/navigation';
const Users = () => {
  const [value, setValue] = React.useState('patient');
  const [search, setSearch] = useState('')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])
  const router = useRouter()

  const [filters, setFilters] = useState({
    specialization: '',
    status: '',
    experience: '',
    roomNumber:''
  })
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axios.get('http://localhost:5000/api/patient')
      setPatients(response.data)
    }
    fetchPatients()
  }, [])
  
  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get('http://localhost:5000/api/doctor')
      setDoctors(response.data)
    }
    fetchDoctors()
  }, [])

  const doctorsColumns = [
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "specialization", label: "Specialization" },
    { key: "yearsOfExperience", label: "Years of Experience" },
    { key: "room_number", label: "Room Number" },
    { key: "appointments", label: "Appointments" }

  ];

  const patientsColumns = [
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "gender", label: "Gender" },
    {key:"appointments",label:"Appointments"}
  ];
  return (
    <AdminLayout>
      <div className='w-[90%]'>
        <p className=' mt-2 text-2xl text-blue-700 font-medium'>System Users</p>
        <p className='mb-7 text-gray-500 text-sm'>Overview of all system users</p>
        <Box sx={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="secondary tabs example"
            sx={{ color: '#2563eb',fontWeight:600,fontSize:'30px' }}
          >
            <Tab value="patient" label="Patients" />
            <Tab value="doctor" label="Doctors" />
          </Tabs>

          {value === "doctor" && (
            <button
              className="text-sm bg-blue-600 text-white px-5 py-3 rounded-md font-medium hover:bg-blue-600 transition-all"
              onClick={()=>router.push('/admin/users/addDoctors')}
            >
              + Add Doctors
            </button>
          )}
        </Box>

        <input
          name="name"
          type="text"
          className="w-full h-12 border my-3 border-gray-400 rounded-md px-3 text-sm focus:outline-none placeholder:text-gray-700"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {value === 'doctor' ? <DoctorFilters doctors={doctors} onFilterChange={handleFilterChange} /> : <PatientFilters onFilterChange={handleFilterChange}/> }
        <TableData data={value === 'doctor'?doctors:patients} columns={value === 'doctor'?doctorsColumns:patientsColumns} search={search} filters={filters} userType={value} name=''/>
      </div>
    </AdminLayout>
  )
}

export default Users