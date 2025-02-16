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
const Users = () => {
  const [value, setValue] = React.useState('patient');
  const [search, setSearch] = useState('')
  const [doctors, setDoctors] = useState([])
  const [patients, setPatients] = useState([])

  const [filters, setFilters] = useState({
    specialization: '',
    status: '',
    experience: '',
    roomNumber:''
  })
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
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
    { key: "status", label: "Status" },
    { key: "appointments", label: "Appointments" }

  ];

  const patientsColumns = [
    { key: "username", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    {key:"appointments",label:"Appointments"}
  ];
  return (
    <AdminLayout>
      <div className='w-[90%]'>
        <p className=' mt-2 text-3xl font-medium'>Users</p>
        <p className='mb-7 text-gray-500 text-sm'>Overview of all system users</p>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            aria-label="secondary tabs example"
            sx={{ color:'#6B4DE6'}}
          >
            <Tab value="patient" label="Patients" />
            <Tab value="doctor" label="Doctors" />
          </Tabs>
        </Box>
        <input
          name="name"
          type="name"
          className={`w-full h-12 border border-gray-300 rounded-md px-3 mt-8 mb-3 text-sm focus: outline-[#DFE1E0] placeholder:text-gray-500`}
          placeholder="search by name or email"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
        {value === 'doctor' ? <DoctorFilters onFilterChange={handleFilterChange} /> : <PatientFilters onFilterChange={handleFilterChange}/> }
        <TableData data={value === 'doctor'?doctors:patients} columns={value === 'doctor'?doctorsColumns:patientsColumns} search={search} filters={filters} userType={value} name=''/>
      </div>
    </AdminLayout>
  )
}

export default Users