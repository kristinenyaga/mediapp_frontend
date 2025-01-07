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
    <div
      className={`sidebar_container ${showSideBar ? 'show' : ''
        } border-r border-gray-300 h-full fixed top-0 left-0 bg-white xl:relative transition-transform xl:translate-x-0 ${showSideBar ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      <div className="xl:p-5 p-3 flex flex-col">
        {/* Close Icon */}
        <Image
          src={patient}
          width={20}
          height={20}
          alt="Close Sidebar"
          className="xl:hidden absolute right-5 top-5 cursor-pointer"
          onClick={() => setShowSideBar(false)}
        />

        {/* Logo Section */}
        <div className="flex justify-center items-center my-8">
          <p className="text-lg font-semibold text-primary">MediApp</p>
        </div>

        {/* Menu Section */}
        <ul className="menu">
          <li className={`menu-item ${pathname === '/patient/home' ? 'active' : ''}`}>
            <Image src={patient} width={22} height={22} className="menu-icon" alt="Home" />
            <Link href="/patient/home" className="menu-text">
              Home
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/patient/book-appointment' ? 'active' : ''}`}>
            <Image src={patient} width={22} height={22} className="menu-icon" alt="Book Appointment" />
            <Link href="/patient/book-appointment" className="menu-text">
              Book Appointment
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/patient/appointments' ? 'active' : ''}`}>
            <Image src={patient} width={22} height={22} className="menu-icon" alt="Appointments" />
            <Link href="/patient/appointments" className="menu-text">
              Appointments
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/patient/notifications' ? 'active' : ''}`}>
            <Image src={patient} width={22} height={22} className="menu-icon" alt="Notifications" />
            <Link href="/patient/notifications" className="menu-text">
              Notifications
            </Link>
          </li>

          {/* Footer Section */}
          <div className="absolute bottom-10 w-full px-3">
            <li className={`menu-item ${pathname === '/patient/profile' ? 'active' : ''}`}>
              <Image src={patient} width={22} height={22} className="menu-icon" alt="Profile" />
              <Link href="/patient/profile" className="menu-text">
                Profile
              </Link>
            </li>
            <li className={`menu-item ${pathname === '/patient/reports' ? 'active' : ''}`}>
              <Image src={patient} width={22} height={22} className="menu-icon" alt="Logout" />
              <Link href="/patient/reports" className="menu-text">
                Logout
              </Link>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
