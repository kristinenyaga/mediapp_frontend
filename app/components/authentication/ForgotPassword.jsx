"use client"
import { useRole } from '@/app/context/RoleContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Notify } from 'notiflix';
import React, { useState } from 'react'
import LoadingScreen from '../loader/Loader';
import GoBack from '../goBack/GoBack';
import Navbar from './Navbar';


const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP, 3 = Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false)

  const [emailError, setEmailError] = useState("");
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  
  const router = useRouter()
  const { role } = useRole()

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSendOtp = async () => {
    if (!email) {
      setEmailError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");

    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/patient/generateotp', {
        email,
        userType:role
      });

      if (response.status === 200) {
        setLoading(false)
        Notify.success("OTP sent to your email")
        setStep(2); 
      } else {
        setLoading(false)
        Notify.failure(response.data.message || "OTP send failed");
      }
    } catch (error) {
      setLoading(false)
      Notify.failure(error.response.data.message)
      // alert("Something went wrong. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setOtpError("Please enter the OTP.");
      return;
    }
    setOtpError("");

    try {
      setLoading(true)
      const response = await axios.post('http://localhost:5000/api/patient/verifyotp', {
        code:otp,
      });

      if (response.status === 200) {
        setLoading(false)
        Notify.success("OTP verified successfully")
        setStep(3);
      } else {
        setLoading(false)
        Notify.failure(response.data.message || "verification failed");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error verifying OTP:", error);
      alert("Invalid or expired OTP. Please try again.");
    }
  };
  const validatePassword = (password) => {
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password.length > 64) return "Password cannot exceed 64 characters.";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
    if (!/\d/.test(password)) return "Password must contain at least one number.";
    if (/\s/.test(password)) return "Password must not contain spaces.";
    return ""; // No error
  };

  const handleResetPassword = async () => {
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    } else {
      setPasswordError("");
    }

    // Validate confirm password
    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match.");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      setLoading(true)

      const response = await axios.post('http://localhost:5000/api/patient/resetpassword', {
        email,
        newPassword: password,
        userType:role
      });

      if (response.status === 200) {
        setLoading(false)
        Notify.success("Password reset successfully")
        router.push('/sign-in')
      } else {
        setLoading(false)
        Notify.failure(response.data.message || "password reset failed");
      }
    } catch (error) {
      setLoading(false)
      console.error("Error resetting password:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  if(loading) return <LoadingScreen />
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-md m-auto">
      <div className='mt-32'>
        <GoBack />
        {step === 1 && (
          <div className='border p-5 shadow-lg'>
            <h2 className="text-[28px] font-medium">Forgot Password?</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter your email to receive a reset code.</p>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full mt-5 p-3 ${emailError ? "border border-red-300" :"border border-gray-300"}  rounded-lg focus:outline-none focus:border-gray-500 mb-4`}
            />
            {emailError && <p className="text-red-300 text-sm">{emailError}</p>}

            <button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md mt-3 font-semibold transition-all hover:scale-105"
            >
              Send OTP
            </button>
          </div>

        )}

        {step === 2 && (
          <div className='border p-5 shadow-lg'>
            <h2 className="text-[28px] font-medium">Verify OTP</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter the code sent to your email.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className={`w-full mt-5 p-3 ${otpError ? "border border-red-300" : "border border-gray-300"}  rounded-lg focus:outline-none focus:border-gray-500 mb-4`}
            />
            {otpError && <p className="text-red-300 text-sm">{otpError}</p>}
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md mt-3 font-semibold transition-all hover:scale-105"
            >
              Verify OTP
            </button>
          </div>
        )}


        {step === 3 && (
          <div className='border p-5 shadow-lg'>
            <h2 className="text-[28px] font-medium">Reset Password</h2>
            <p className="text-gray-600 mb-4 text-sm">Enter your new password below.</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className={`w-full mt-5 p-3 ${passwordError ? "border border-red-300" : "border border-gray-300"}  rounded-lg focus:outline-none focus:border-gray-500 mb-4`}

            />
            {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={`w-full mt-5 p-3 ${passwordError ? "border border-red-300" : "border border-gray-300"}  rounded-lg focus:outline-none focus:border-gray-500 mb-4`}

            />
            {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
            <button
              onClick={handleResetPassword}
              className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md mt-3 font-semibold transition-all hover:scale-105"
            >
              Reset Password
            </button>
          </div>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">Password Reset Successful 🎉</h2>
            <p className="text-gray-600 mb-4">You can now log in with your new password.</p>
            <button
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
    </>

  );

}

export default ForgotPassword