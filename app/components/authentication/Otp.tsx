"use client";
import React, { useState } from "react";

const Otp = () => {
  const [code, setCode] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");


  return (
    <div className="flex flex-row justify-between space-y-32 gap-y-0.5">
      <div></div>
      <div>
        <div className="">

          <p className="text-2xl font-medium mb-5">Two-Factor Authentication</p>
          <p className="text-[14px] font-normal mb-6 text-gray-700 ">
            We&apos;ve sent a 6-digit code to
            <span className="font-medium  pl-1 text-blue-300">johndoe@gmail.com</span>. 
            <p className="mt-3 text-center">Please enter the code below.</p>
          </p>
          <form>
            <div className="flex flex-row space-x-3 mb-6">
              {code.map((_, index) => (
                <input
                  key={index}
                  type="text"
                  className="w-12 h-12 border-gray-400 rounded-lg border text-center"
                  value={code[index]}
                  onFocus={(e) => e.target.select()}
                />
              ))}
            </div>
            <button
              className="bg-blue-300 w-full mb-6 h-12 rounded-[8px] text-white text-base font-medium"
              type="submit"
            >
              Continue
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <p className="text-xs font-medium hover:underline underline-offset-4 text-center cursor-pointer">
            Resend code
          </p>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default Otp;
