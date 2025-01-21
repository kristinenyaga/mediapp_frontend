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
          <li className={`menu-item ${pathname === '/doctor/overview' ? 'active' : ''}`}>
            <Image src={home} width={22} height={22} className="menu-icon" alt="overview" />
            <Link href="/doctor/overview" className="menu-text">
              Overview
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/doctor/patients' ? 'active' : ''}`}>
            <Image src={calendar} width={22} height={22} className="menu-icon" alt="patients" />
            <Link href="/doctor/patients" className="menu-text">
              Patients
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/doctor/appointments' ? 'active' : ''}`}>
            <Image src={calendar} width={22} height={22} className="menu-icon" alt="Appointments" />
            <Link href="/doctor/appointments" className="menu-text">
              Appointments
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/doctor/notifications' ? 'active' : ''}`}>
            <Image src={notifications} width={22} height={22} className="menu-icon" alt="Notifications" />
            <Link href="/doctor/notifications" className="menu-text">
              Notifications
            </Link>
          </li>
          <li className={`menu-item ${pathname === '/doctor/reports' ? 'active' : ''}`}>
            <Image src={calendar} width={22} height={22} className="menu-icon" alt="reports" />
            <Link href="/doctor/reports" className="menu-text">
              Reports
            </Link>
          </li>

          {/* Footer Section */}
          <div className="absolute bottom-20 w-full p-0 border-t border-gray-300">
            <li className={`menu-item mt-5 ${pathname === '/doctor/profile' ? 'active' : ''}`}>
              <Image src={profile} width={22} height={22} className="menu-icon" alt="Profile" />
              <Link href="/doctor/profile" className="menu-text">
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
