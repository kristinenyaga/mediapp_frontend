import React from 'react'
import DoctorLayout from '../doctorLayout'
import Header from '../Header'
import Image from 'next/image'
import { appointmentBlue, appointmentRed, appointmentGreen } from '@/public/constants/images'
const OverviewPage = () => {
  return (
    <DoctorLayout>
      <Header />
      <div className='mt-8'>
        <div className='flex gap-5 justify-between w-[100%] xl:w-[80%] pr-5'>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center'>
              <div className='flex justify-center items-center rounded-full w-14 h-14 bg-gray-300'>
                <Image src={appointmentBlue} alt='apps icon' />
              </div>
              <p className='text-blue-300'>Upcoming <br /> Apppointments</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center px-2'>
              <div className='flex justify-center items-center rounded-full w-14 h-14 bg-gray-300'>
                <Image src={appointmentGreen} alt='apps icon' />
              </div>
              <p className=' text-brand-500'>Comleted <br /> Apppointments</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>
          <div className='flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md'>
            <div className='flex gap-5 items-center px-2'>
              <div className='flex justify-center items-center rounded-full w-14 h-14 bg-gray-300'>
                <Image src={appointmentRed} alt='apps icon' />
              </div>
              <p className=' text-red-400'>Cancelled <br /> Apppointments</p>
            </div>
            <p className='text-gray-700 text-2xl pr-2'>50</p>
          </div>

        </div>
      </div>
    </DoctorLayout>
  )
}

export default OverviewPage