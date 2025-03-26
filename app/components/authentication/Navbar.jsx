import { logo } from '@/public/constants/images'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const Navbar = () => {
  const router = useRouter()
  return (
    <div className='w-[80%] mt-5 ml-10'>
      <Image onClick={()=>router.push('/')} className='cursor-pointer' src={logo} width={160} height={40} alt="Logo" />
    </div>
  )
}

export default Navbar