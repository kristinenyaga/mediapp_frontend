'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './sidebar.css';
import { patient } from '@/public/constants/images';
interface SideBarProps {
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ showSideBar, setShowSideBar }) => {
  const pathname = usePathname();

  return (
    <div className={`sidebar_container border-r border-gray-300 h-full relative bg-white ${showSideBar ? 'show' : ''}`}>
      <div className='xl:p-5 p-2 flex flex-col '>
        <Image
          src={patient}
          width={20}
          height={20}
          alt='cross icon'
          className='xl:hidden absolute right-5 top-5 cursor-pointer'
          onClick={() => setShowSideBar(false)}
        />
        <div className='flex justify-center items-center'>
          <div className='px-2 mt-14 xl:mt-0'>
            <p>MediApp</p>
          </div>
        </div>
        <div>
          <ul className='menu'>
            <li className={`menu-item ${pathname === '/patient/home' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='apps icon' />
              <Link href="/patient/home" className='menu-text'>Home</Link>
            </li>
            <li className={`menu-item ${pathname === '/patient/book-appointment' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='bell icon' />
              <Link href="/patient/book-appointment" className='menu-text'>Book Appointment</Link>
            </li>
            <li className={`menu-item ${pathname === '/patient/appointments' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='wifi icon' />
              <Link href="/patient/appointments" className='menu-text'>Appointments</Link>
            </li>
            <li className={`menu-item ${pathname === '/patient/notifications' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='bell icon' />
              <Link href="/patient/notifications" className='menu-text'>Notifications</Link>
            </li>
            <div className='absolute bottom-40'>
              <li className={`menu-item ${pathname === '/patient/profile' ? 'active' : ''}`} >
                <Image src={patient} width={22} height={22} className='menu-icon' alt='document icon' />
                <Link href="/patient/profile" className='menu-text'>Profile</Link>
              </li>
              <li className={`menu-item ${pathname === '/patient/reports' ? 'active' : ''}`} >
                <Image src={patient} width={22} height={22} className='menu-icon' alt='user icon' />
                <Link href="/patient/reports" className='menu-text'>Logout</Link>
              </li>
            </div>

          </ul>
        </div>
      </div>
    </div>

  )
}

export default SideBar;
