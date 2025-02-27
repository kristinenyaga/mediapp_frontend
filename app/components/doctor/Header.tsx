import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center w-[90%]'>
      <div>
        <p className='text-2xl text-gray-700 font-medium'>Welcome back!</p>
        <p className='text-gray-500 text-sm'>Here is an overview of appointments and patient data</p>
      </div>
      <div>
        <p className='text-sm'>DR. Kris Nyaga</p>
      </div>
    </div>
  )
}

export default Header