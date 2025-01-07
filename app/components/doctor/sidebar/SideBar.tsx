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
    <div className={`sidebar_container border-r border-gray-300 h-full bg-white ${showSideBar ? 'show' : ''}`}>
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
            <li className={`menu-item ${pathname === '/doctor/overview' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='apps icon' />
              <Link href="/doctor/overview" className='menu-text'>Overview</Link>
            </li>
            <li className={`menu-item ${pathname === '/doctor/appointments' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='wifi icon' />
              <Link href="/doctor/appointments" className='menu-text'>Appointments</Link>
            </li>
            <li className={`menu-item ${pathname === '/doctor/patients' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='bell icon' />
              <Link href="/doctor/patients" className='menu-text'>Patients</Link>
            </li>
            <li className={`menu-item ${pathname === '/doctor/diagnosis' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='document icon' />
              <Link href="/doctor/diagnosis" className='menu-text'>Diagnosis</Link>
            </li>
            <li className={`menu-item ${pathname === '/doctor/reports' ? 'active' : ''}`} >
              <Image src={patient} width={22} height={22} className='menu-icon' alt='user icon' />
              <Link href="/doctor/reports" className='menu-text'>Reports</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>

  )
}

export default SideBar;
