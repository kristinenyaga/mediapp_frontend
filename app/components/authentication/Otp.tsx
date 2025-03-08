"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { Notify } from "notiflix";
import * as Yup from "yup";
import axios, { AxiosError } from "axios";
import { useAuth } from "@/app/context/authContext";
import { useRole } from "@/app/context/RoleContext";
import LoadingScreen from "../loader/Loader";
const Otp = () => {
  const inputRefs = useRef([]);
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole()

  const formik = useFormik({
    initialValues: {
      otp:''
    },
    validationSchema: Yup.object({
      otp:(Yup.string().required("Required"))
        .required("OTP is required"),
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
            router.push("/patient/book-appointment");
          }
          else {
            router.push("/admin/home")
          }
        } else {
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.data) {
            console.error("Error:", axiosError.response.data.error);
            setIsLoading(false)
            Notify.failure(axiosError.response.data.error);
          } else {
            console.error("Unexpected Axios error:", axiosError.message);
            setIsLoading(false)
            Notify.failure("Something went wrong. Please try again.");
          }
        } else {
          console.error("Unexpected error:", error);
          setIsLoading(false)
          Notify.failure("Something went wrong. Please try again.");
        }
      }
    },
  });

  const inputChange = (value) => {
    formik.setFieldValue("otp",value)
  }

  const handleResendOTP = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/patient/resendotp", {
        email: user.email,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        Notify.success("OTP resent successfully!");
      } else {
        Notify.failure("Failed to resend OTP. Please try again.");
      }
    } catch (error) {
      console.log(error)
      Notify.failure("Failed to resend OTP. Please try again.");
    }
  };

  if(isLoading) return <LoadingScreen />
  return (
    <div className="flex flex-col items-center space-y-32 mt-36 gap-y-8">
      <div>
        <p className="text-2xl font-medium mb-5 text-center">Two-Factor Authentication</p>
        <div className="text-[14px] text-center font-normal mb-6 text-gray-700">
          <span>We&apos;ve sent a 6-digit code to your email </span>
          <span className="font-medium text-blue-300">{user?.email}</span>.
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
