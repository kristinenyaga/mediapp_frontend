"use client"
import React, { useState, ReactNode } from "react";
import SideBar from "./sidebar/SideBar";

const DoctorLayout = ({ children }: { children: ReactNode }) => {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <div className='layout'>
      <div>
        <SideBar showSideBar={showSideBar} setShowSideBar={setShowSideBar} />
      </div>
      <main className='content'>
        {children}
      </main>
    </div>
  );
};

export default DoctorLayout;
