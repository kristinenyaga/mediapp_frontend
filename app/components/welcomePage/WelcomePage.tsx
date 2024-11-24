"use client"
import Image from 'next/image'
import React from 'react'
import { useRole } from '@/app/context/RoleContext'
import { doctor,patient } from '@/public/constants/images'
const WelcomePage = () => {
  const { setRole, role } = useRole()
  
  const handleRoleSelection = (role:string) => {
    setRole(role)
  }
  console.log(role)
  return (
    <div className='flex flex-col gap-3 justify-center items-center h-[80vh]'>
      <div className='flex items-center gap-1'>
        <p className='text-display-xs text-gray-700'>Welcome to</p>
        <p className='text-display-xs text-blue-300'>MediApp</p>
      </div>
      <p className='text-gray-500'>select your role</p>
      <div className='flex gap-10 mt-10'>
        <div className='border border-[#C1C3C2] rounded-md py-5 px-10 cursor-pointer' onClick={()=>handleRoleSelection('patient')}>
          <Image src={patient} alt='patient' />
          <p className='text-center pt-2 text-gray-500'>Patient</p>
        </div>
        <div className='border border-[#C1C3C2] rounded-md py-5 px-10 cursor-pointer hover:bg-blue-300' onClick={() => handleRoleSelection('doctor')} >
          <Image src={doctor} alt='patient' />
          <p className='text-center pt-2 text-gray-500'>Doctor</p>
        </div>

      </div>
    </div>
  )
}

export default WelcomePage