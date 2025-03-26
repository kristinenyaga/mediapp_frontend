'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import './sidebar.css';
import { FaHome,FaCalendarCheck, FaChartBar, FaSignOutAlt, FaUsers } from "react-icons/fa";
import { logo } from '@/public/constants/images';
import { useAuth } from '@/app/context/authContext';
import { useRole } from '@/app/context/RoleContext';


const menuItems = [
  { name: 'Overview', path: '/admin/home', icon: <FaHome size={20} /> },
  { name: 'User Management', path: '/admin/users', icon: <FaUsers size={20} /> },
  { name: 'Appointments Management ', path: '/admin/appointments', icon: <FaCalendarCheck size={20} /> },
  { name: 'Analytics', path: '/admin/analytics', icon: <FaChartBar size={20} /> },
  // { name: 'System Settings', path: '/doctor/notifications', icon: <FaBell size={20} /> },
  // { name: 'Profile', path: '/admin/profile', icon: <FaUser size={20} /> },
];

const SideBar = () => {
  const pathname = usePathname();
    const router = useRouter()
    const { user } = useAuth()
    const { role } = useRole()
    
    const handleLogout = () => {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refreshtoken')
      sessionStorage.removeItem('email');
      sessionStorage.removeItem('username')
      localStorage.removeItem('role')
      router.push('/welcomepage')
    }

  return (
    <aside className="relative left-0 top-0 h-full w-64 bg-white backdrop-blur-lg shadow border-r border-gray-300 flex flex-col">
      {/* Logo */}
      <div className="p-6 flex flex-col items-center border-b border-gray-200">
        <Image src={logo} width={160} height={40} alt="Logo" />

        {/* User Info */}
        <div className="mt-4 flex items-center text-center">
          <p className="mt-2 text-gray-700 font-medium">{user?.username} ~ {role}</p>
        </div>
      </div>


      {/* Menu Items */}
      <nav className="flex-1 mt-4 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center mt-4 border-b gap-3 p-3 rounded-lg transition-all text-gray-700 text-sm font-medium
                  ${pathname === item.path ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md' : 'hover:bg-blue-50'}`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Logout */}
      <ul className=" border-y pb-24 pt-4 px-4">
        <li
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-700 text-sm font-medium transition-all cursor-pointer hover:bg-red-100 hover:text-red-600"
        >
          <FaSignOutAlt size={20} className="mr-3" />
          <span>Log Out</span>
        </li>
      </ul>

    </aside>
  );
};

export default SideBar;
