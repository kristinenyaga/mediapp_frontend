"use client"
import React from 'react'
import { FaStethoscope } from 'react-icons/fa'
import { doctorDp } from '@/public/constants/images'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
const Doctors = () => {
  const router = useRouter()
  return (
    <div className=' max-w-[1280px] mt-28 mx-auto' id='doctors'>
      <p className='text-[#16213E] text-center text-[30px] font-semibold'>Meet Our Experts</p>
      <p className='text-gray-600 text-center w-[50%] mx-auto'>We provide excellent services for your ultimate good health. </p>
      <div className='grid grid-cols-2 gap-11 mt-10'>
        <div className='border border-gray-200 rounded-md flex justify-between items-center p-5'>
          <div>
            <Image src={doctorDp} alt='doctorDp' />
          </div>
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-secondary font-semibold '>Dr Kristine Nyaga</p>
                <p className='text-gray-600 text-[15px]'>General Practioner</p>
              </div>
              <div className='flex items-center justify-center px-4 py-4 rounded-full'>
               
              </div>
            </div>

            <p className='text-gray-600 text-[14px] mt-3 w-[80%]'>Lorem ipsum dolor sit amet consectur adipisc elit sed eiusmod tempor.</p>
            <p className='text-gray-300 mt-3'>| <span className='text-[#39cabb] text-sm'>Available Today</span></p>
          </div>
        </div>
        <div className='border border-gray-200 rounded-md flex justify-between items-center p-5'>
          <div>
            <Image src={doctorDp} alt='doctorDp' />
          </div>
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-secondary font-semibold text-lg'>Dr Kristine Nyaga</p>
                <p className='text-gray-600 text-[15px]'>General Practioner</p>
              </div>
              <div className='flex items-center justify-center px-4 py-4 rounded-full'>
               
              </div>
            </div>

            <p className='text-gray-600 text-[14px] mt-3 w-[80%]'>Lorem ipsum dolor sit amet consectur adipisc elit sed eiusmod tempor.</p>
            <p className='text-gray-300 mt-3'>| <span className='text-[#39cabb] text-sm'>Available Today</span></p>
          </div>
        </div>
        <div className='border border-gray-200 rounded-md flex justify-between items-center p-5'>
          <div>
            <Image src={doctorDp} alt='doctorDp' />
          </div>
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-secondary font-semibold text-lg'>Dr Kristine Nyaga</p>
                <p className='text-gray-600 text-[15px]'>General Practioner</p>
              </div>
              <div className='flex items-center justify-center px-4 py-4 rounded-full'>
               
              </div>
            </div>

            <p className='text-gray-600 text-[14px] mt-3 w-[80%]'>Lorem ipsum dolor sit amet consectur adipisc elit sed eiusmod tempor.</p>
            <p className='text-gray-300 mt-3'>| <span className='text-[#39cabb] text-sm'>Available Today</span></p>
          </div>
        </div>
        <div className='border border-gray-200 rounded-md flex justify-between items-center p-5'>
          <div>
            <Image src={doctorDp} alt='doctorDp' />
          </div>
          <div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-secondary font-semibold text-lg'>Dr Kristine Nyaga</p>
                <p className='text-gray-600 text-[15px]'>General Practioner</p>
              </div>
              <div className='flex items-center justify-center px-4 py-4 rounded-full'>
               
              </div>
            </div>

            <p className='text-gray-600 text-[14px] mt-3 w-[80%]'>Lorem ipsum dolor sit amet consectur adipisc elit sed eiusmod tempor.</p>
            <p className='text-gray-300 mt-3'>| <span className='text-[#39cabb] text-sm'>Available Today</span></p>
          </div>
        </div>
      </div>

      <button className='flex justify-center items-center mx-auto mt-10 bg-secondary text-white px-6 py-3 rounded-md' onClick={()=>router.push('/available-doctors')}>View more</button>

    </div>
  )
}

export default Doctors