'use client';

import Link from 'next/link';
import React, { useState } from 'react';
import { RiArrowDropDownLine, RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { MdMenu } from "react-icons/md";
const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <div className="w-screen fixed top-0 left-0 z-50 ">
      <div className="max-w-[1280px] m-auto flex gap-10 items-center py-5 px-5 font_open_sans">
        <Link href="/">
          <p className="font-medium text-lg cursor-pointer">MediQueue</p>
        </Link>

        <div className="hidden lg:flex flex-1">
          <ul className="flex flex-1 justify-evenly items-center">
            <Link href="/">
              <li className="text-[14px] cursor-pointer">Home</li>
            </Link>
            <Link href="/#doctors">
              <li className="text-[14px] cursor-pointer">Doctors</li>
            </Link>
            <Link href="/#about">
              <li className="text-[14px] cursor-pointer">About</li>
            </Link>
            <Link href="/#works">
              <li className="text-[14px] cursor-pointer">How It Works</li>
            </Link>
            <Link href="/#faq">
              <li className="text-[14px] cursor-pointer">FAQ</li>
            </Link>
          </ul>
        </div>

        <div className='flex items-center gap-10'>
          <Link href="/sign-in">
            <button className="hidden lg:block bg-[#6B4DE6] text-white text-[14px] py-2.5 px-10 rounded-[8px]">
              Login
            </button>
          </Link>
          <Link href="/sign-up">
            <button className="hidden lg:block border border-[#6B4DE6] text-[#6B4DE6] shadow-lg text-[14px] py-2.5 px-8 rounded-[8px]">
              Sign Up
            </button>
          </Link>
        </div>

        <div className="lg:hidden absolute right-5">
          <button onClick={toggleDrawer} className="text-2xl">
            <MdMenu className='text-2xl' />
          </button>
        </div>
      </div>

      {isDrawerOpen && (
        <div className="fixed top-0 left-0 h-screen w-3/4 max-w-[300px] bg-[#FDFDFF] shadow-lg z-40">
          <div className="flex justify-between items-center p-5 mt-3">
            <Link href="/">
              <p className="font-semibold text-base cursor-pointer">SynthSoftware</p>
            </Link>
            <button onClick={toggleDrawer} className="text-2xl">
              <RiCloseLine />
            </button>
          </div>
          <ul className="flex flex-col px-5 gap-4 mt-4">
            <Link href="/">
              <li className="text-base cursor-pointer">Home</li>
            </Link>
            <Link href="/#about">
              <li className="text-base cursor-pointer">About</li>
            </Link>
            <Link href="/#works">
              <li className="text-base cursor-pointer">How It Works</li>
            </Link>
            <Link href="/#faq">
              <li className="text-base cursor-pointer">FAQ</li>
            </Link>
            <Link href="/" onClick={toggleDrawer}>
              <button className=" bg-[#6B4DE6] text-white text-base py-3 px-10 rounded-[100px]">
                Book a call
              </button>
            </Link>
          </ul>
        </div>
      )}
    </div>

  );
};

export default Navbar;