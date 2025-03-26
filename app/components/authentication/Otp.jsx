"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notify } from "notiflix";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "@/app/context/authContext";
import { useRole } from "@/app/context/RoleContext";
import LoadingScreen from "../loader/Loader";

const Otp = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole()

  const formik = useFormik({
    initialValues: {
      otp:''
    },
    validationSchema: Yup.object({
      otp: Yup.string().required("OTP is required"),

    }),
    onSubmit: async (values) => {
      const otpCode = values.otp 
      setIsLoading(true)
      try {
        const response = await axios.post("http://localhost:5000/api/patient/verifyotp", {
          code: otpCode,
        });

        if (response.status === 200) {
          setIsLoading(false)
          Notify.success("OTP Verified successfully!");
          if (role === 'doctor') {
            router.push('/doctor/overview')
          }
          else if (role === 'patient') {
            router.push("/patient/home");
          }
          else {
            router.push("/admin/home")
          }
        } else {
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error) {
          setIsLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            setIsLoading(false)
            Notify.failure("Error: " + error.response.data.error);
          } else {
            setIsLoading(false)
            Notify.failure("Unexpected Axios error: " + error.message);
          }
        } else {
          setIsLoading(false)
          Notify.failure("Unexpected error: " + error);
        }
        setIsLoading(false);
      }

    },
  });

  const inputChange = (value) => {
    formik.setFieldValue("otp",value)
  }

  const handleResendOTP = async () => {
    if (!user?.email) {
      Notify.failure("User email not found. Please log in again.");
      return;
    }

    try {
      setIsLoading(true)

      let endpoint = ""
      if (role === 'patient') {
        endpoint = "http://localhost:5000/api/patient/resendotp"
      } else if (role === 'doctor') {
        endpoint = "http://localhost:5000/api/doctor/resendotp"
      } else {
        endpoint = "http://localhost:5000/api/admin/resendotp"
      }
      const response = await axios.post(endpoint, {
        email: sessionStorage.getItem('email'),
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setIsLoading(false)
        Notify.success("OTP resent successfully!");
      } else {
        setIsLoading(false)
        Notify.failure("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      setIsLoading(false)
      Notify.failure("Failed to resend OTP. Please try again.",error);
    }
  };
  
  if(isLoading) return <LoadingScreen />
  return (
    <div className="flex flex-col items-center space-y-32 mt-36 gap-y-8">
      <div>
        <p className="text-2xl font-medium mb-5 text-center">Two-Factor Authentication</p>
        <div className="text-[14px] text-center font-normal mb-6 text-gray-700">
          <span>We&apos;ve sent a 6-digit code to your email </span>
          <div className="mt-3 text-center text-purple-600">Please enter the code below.</div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            className="w-full  h-12 border-gray-400 rounded-lg border text-center focus:outline-secondary focus:outline-1"
            onChange={(e) => inputChange(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
          {formik.errors.otp && formik.touched.otp && (
            <p className="text-red-500 text-sm">{formik.errors.otp}</p>
          )}
          <button
            className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md mt-4 font-semibold transition-all hover:scale-105"
            type="submit"
          >
            Continue
          </button>
        </form>
        <p
          className={`text-sm font-medium hover:underline underline-offset-4 text-center cursor-pointer text-[#6B4DE6] mt-5`}
          onClick={handleResendOTP}
        >
          Resend Code
        </p>
      </div>
    </div>
  );
};

export default Otp;
