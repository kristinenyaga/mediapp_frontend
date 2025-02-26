'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FaHome, FaUser, FaClipboardList, FaCalendarCheck, FaChartBar, FaBell, FaSignOutAlt, FaUserFriends, FaUsers } from "react-icons/fa";
import { IoMdClose } from 'react-icons/io';
import './sidebar.css';
import { logo } from '@/public/constants/images';


interface SideBarProps {
  showSideBar: boolean;
  setShowSideBar: (show: boolean) => void;
}
const menuItems = [
  { name: 'Overview', path: '/doctor/overview', icon: <FaHome size={20} /> },
  { name: 'Patients', path: '/doctor/patients', icon: <FaUsers size={20} /> },
  { name: 'Appointments', path: '/doctor/appointments', icon: <FaCalendarCheck size={20} /> },
  { name: 'Reports', path: '/doctor/reports', icon: <FaChartBar size={20} /> },
  { name: 'Notifications', path: '/doctor/notifications', icon: <FaBell size={20} /> },
  { name: 'Profile', path: '/doctor/profile', icon: <FaUser size={20} /> },
];
const SideBar: React.FC<SideBarProps> = ({ showSideBar, setShowSideBar }) => {
  const pathname = usePathname();

  return (
    <div
      className={`sidebar_container ${showSideBar ? 'show' : ''} fixed top-0 left-0 w-64 h-full bg-white shadow xl:relative transition-transform xl:translate-x-0 ${showSideBar ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="flex flex-col h-full p-5">
        <IoMdClose
          size={24}
          className="xl:hidden absolute right-5 top-5 cursor-pointer text-gray-600 hover:text-gray-900"
          onClick={() => setShowSideBar(false)}
        />

        <div className="flex justify-center items-center mb-8 border-b py-2">
          <Image
            src={logo}
            width={160}
            height={20}
            alt="Close Sidebar"
          />
        </div>
        <ul className="menu space-y-3 flex-1">
          {menuItems.map((item) => (
            <li
              key={item.path}
              className={`flex text-sm hover:bg-blue-0 items-center p-3 rounded-lg transition-all cursor-pointer ${pathname === item.path ? 'bg-blue-700 text-white' : 'hover:bg-gray-100 border-b text-gray-600'}`}
            >
              <span className="mr-3">{item.icon}</span>
              <Link href={item.path} className="menu-text">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="border-t pb-14 border-gray-300 pt-4">
          <li className="flex items-center p-3 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer">
            <FaSignOutAlt size={20} className="mr-3" />
            <p className="menu-text font-medium">Log Out</p>
          </li>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
