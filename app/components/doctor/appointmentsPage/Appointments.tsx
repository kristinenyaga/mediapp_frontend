"use client"
import React from 'react';
import DoctorLayout from '../doctorLayout';
import { HiOutlineArrowLongRight } from "react-icons/hi2";
import EnhancedTable from './TableContainer';


const Appointments = () => {
  const getCurrentDate = () => {
    const date = new Date();

    // Get day with ordinal suffix
    const day = date.getDate();
    const ordinal =
      day % 10 === 1 && day !== 11
        ? 'st'
        : day % 10 === 2 && day !== 12
          ? 'nd'
          : day % 10 === 3 && day !== 13
            ? 'rd'
            : 'th';
    const dayWithOrdinal = `${day}${ordinal}`;

    // Get month and year
    const month = date.toLocaleString('default', { month: 'short' }); // Nov
    const year = date.getFullYear();

    return `${dayWithOrdinal} ${month} ${year}`;
  };

  return (
    <DoctorLayout>
      <div className='px-5'>
        <div className='flex  justify-between items-center xl:w-[90%]' >
          <div className='flex items-center gap-5 mt-3'>
            <p className='font-medium text-[20px]'>Today&apos;s Appointments</p>
            <p className='bg-blue-100 text-blue-300 p-3 w-[150px] text-center rounded-md text-sm'>{getCurrentDate()}</p>
          </div>
          <p className='text-blue-300 cursor-pointer hover:underline underline-offset-4 mt-5 flex gap-3 items-center'>All Appointments <HiOutlineArrowLongRight className='text-blue-300 text-2xl' /></p>
        </div>
        <div className='mt-5 mb-5'>
          <input
            type='text'
            placeholder='Search appointments by patient ID...'
            className='w-[90%] border border-gray-300 rounded-md p-3 py-4 focus:outline-none focus:ring-1 focus:ring-gray-600 placeholder:text-sm'
          />
        </div>
        <EnhancedTable />
      </div>
    </DoctorLayout>
  );
};

export default Appointments;
