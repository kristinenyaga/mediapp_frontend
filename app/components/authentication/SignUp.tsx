"use client";
import React, { useState } from "react";
import Link from "next/link";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");


  return (
    <>
      <div className="flex flex-row justify-between space-y-32 gap-y-0.5">
        <div></div>
        <div>
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[28px] font-medium">Sign Up</p>
            <p className="text-xs text-gray-500 font-normal mb-5">
              Get started with us !
            </p>
            <form action="">
              <label htmlFor="username" className="text-xs font-normal">
                Username*
              </label>
              <br />
              <input
                name="username"
                type="username"
                className="w-[400px] h-[50px] border rounded-md border-gray-400 px-2 text-base placeholder:text-sm placeholder:text-gray-500 mb-5 "
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <br />
              <label htmlFor="email" className="text-xs font-normal">
                Email*
              </label>
              <br />
              <input
                name="email"
                type="email"
                className="w-[400px] h-[50px] border rounded-md border-gray-400 px-2 text-base placeholder:text-sm placeholder:text-gray-500 mb-5 "
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <br />
              <label htmlFor="password" className="text-xs font-normal w-80 pt-5">
                Password*
              </label>
              <br />
              <input
                name="password"
                type="password"
                className="w-[400px] h-[50px] border rounded-md border-gray-400 px-2 text-base placeholder:text-sm placeholder:text-gray-500 focus:border-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <br />
              {error && <p style={{ color: "red" }}>{error}</p>}
              <button
                className="bg-blue-300 rounded-[8px] w-[400px] h-12 text-white text-base font-medium mt-8"
                type="submit"
              >
                Sign in
              </button>
            </form>
            <div className="mt-5 flex items-center gap-1 justify-center text-[14px]">
              <p>Already have an account ?</p>
              <p className="hover:underline underline-offset-4 cursor-pointer text-blue-300">Sign In</p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default SignUp;
