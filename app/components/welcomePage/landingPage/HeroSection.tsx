import { booking, heartBeat, heroImage, stethoscope } from '@/public/constants/images'
import Image from 'next/image'
import React from 'react'

const HeroSection = () => {
  return (
    <div className='flex flex-col lg:justify-center items-center relative '>
      <p className='text-center text-[48px] lg:leading-[80px] text-[#202020] font_dm_serif mt-28 '>Smart <span className='text-[#6B4DE6] font_dm_serif'>Symptom Analysis</span> & Seamless <br className='hidden md:block' /> Appointment <span className='text-[#6B4DE6] font_dm_serif'>Booking</span> for Better Care</p>
      <Image src={booking} alt='accent one' className='absolute md:top-[20%] mmd:top-[16%] lg:top-[18%] xs:top-[35%]  md:left-[85%] mmd:left-[90%] xl:left-[83%] xl:top-[16%] 2xl:left-[75%] 2xl:top-[18%] lg:left-[90%] top-[29%] left-[87%] w-[10%] xs:left-[80%] lg:w-[6%] 2xl:w-[4%] -rotate-12' />
      <Image src={stethoscope} alt='accent one' className='absolute 2xl:top-[15%] xs:top-[35%]  2xl:right-[74%] md:top-[35%] md:right-[75%] top-[30%] right-[75%] mmd:top-[30%] mmmd:top-[40%]  slg:top-[40%] -rotate-12' />
      <Image src={heartBeat} alt='accent one' className='absolute 2xl:top-[28%] xs:top-[35%]  2xl:right-[70%] md:top-[35%] md:right-[75%] top-[30%] right-[75%] mmd:top-[30%] mmmd:top-[40%]  slg:top-[40%] -rotate-12' />
      <p className='text-center max-w-[50%] lg:text-[16px] text-[14px] font-normal font_open_sans lg:mt-8 mt-5'>An intelligent medical assistant designed for faster, more accurate diagnoses <br/>and better doctor-patient connections.</p>
      <button className='rounded-lg bg-[#6B4DE6] text-white lg:text-base font-semibold font_open_sans py-3.5 px-14 mt-7 lg:mt-10 text-sm'>Get Started</button>
      <Image src={heroImage} alt='hero image' className='w-[88%] mmd:h-[60%] lg:w-[75%] xl:w-[64%] 2xl:w-[37%] mt-16 mb-16 rounded-md' />
    </div>
  )
}

export default HeroSection