'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import './sidebar.css';
import { appointmentbook, calendar, home, logo, logout, notifications, patient, profile } from '@/public/constants/images';

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
      <div className="flex flex-col">
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
          <Image
            src={logo}
            width={180}
            height={20}
            alt="Close Sidebar"
          />
        </div>

        {/* Menu Section */}
        <ul className="menu">
          <li className={`menu-item ${pathname === '/admin/home' ? 'active' : ''}`}>
            <Image src={home} width={22} height={22} className="menu-icon" alt="Home" />
            <Link href="/admin/home" className="menu-text">
              Overview
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/admin/users' ? 'active' : ''}`}>
            <Image src={appointmentbook} width={22} height={22} className="menu-icon" alt="Book Appointment" />
            <Link href="/admin/users" className="menu-text">
              User Management
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/admin/appointments' ? 'active' : ''}`}>
            <Image src={calendar} width={22} height={22} className="menu-icon" alt="Appointments" />
            <Link href="/admin/appointments" className="menu-text">
              Appointments Management 
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/admin/diagnoses' ? 'active' : ''}`}>
            <Image src={notifications} width={22} height={22} className="menu-icon" alt="Notifications" />
            <Link href="/admin/diagnoses" className="menu-text">
              Diagnoses & Analytics
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/patient/notifications' ? 'active' : ''}`}>
            <Image src={notifications} width={22} height={22} className="menu-icon" alt="Notifications" />
            <Link href="/patient/notifications" className="menu-text">
              System Settings
            </Link>
          </li>

          {/* Footer Section */}
          <div className="absolute bottom-20 w-full p-0 border-t border-gray-300">
            <li className={`menu-item mt-5 ${pathname === '/patient/profile' ? 'active' : ''}`}>
              <Image src={profile} width={22} height={22} className="menu-icon" alt="Profile" />
              <Link href="/patient/profile" className="menu-text">
                Profile
              </Link>
            </li>
            <li className={`menu-item`}>
              <Image src={logout} width={22} height={22} className="menu-icon" alt="Logout" />
              <p className="menu-text">
                Log Out
              </p>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default SideBar;
