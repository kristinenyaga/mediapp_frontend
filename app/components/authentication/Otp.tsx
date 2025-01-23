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
      otp: new Array(6).fill(""),
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().required("Required"))
        .required("OTP is required"),
    }),
    onSubmit: async (values) => {
      const otpCode = values.otp.join(""); 
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
          } else {
            router.push("/patient/home");

          }
        } else {
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (axiosError.response && axiosError.response.data) {
            console.error("Error:", axiosError.response.data.error);
            Notify.failure(axiosError.response.data.error);
          } else {
            console.error("Unexpected Axios error:", axiosError.message);
            Notify.failure("Something went wrong. Please try again.");
          }
        } else {
          console.error("Unexpected error:", error);
          Notify.failure("Something went wrong. Please try again.");
        }
      }
    },
  });


  const handleInputChange = (index, value) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...formik.values.otp];
      newOtp[index] = value;
      formik.setFieldValue("otp", newOtp);

      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

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
      Notify.failure("Failed to resend OTP. Please try again.");
    }
  };

  if(isLoading) return <LoadingScreen />
  return (
    <div className="flex flex-col items-center space-y-32 mt-36 gap-y-8">
      <div>
        <p className="text-2xl font-medium mb-5">Two-Factor Authentication</p>
        <div className="text-[14px] text-center font-normal mb-6 text-gray-700">
          <span>We&apos;ve sent a 6-digit code to your email </span>
          <span className="font-medium text-blue-300">{user?.email}</span>.
          <div className="mt-3 text-center">Please enter the code below.</div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-row space-x-3 mb-6">
            {formik.values.otp.map((value, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                className="w-12 h-12 border-gray-400 rounded-lg border text-center"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            ))}
          </div>
          {formik.errors.otp && formik.touched.otp && (
            <p className="text-red-500 text-sm">{formik.errors.otp}</p>
          )}
          <button
            className="bg-blue-300 w-full mb-6 h-12 rounded-[8px] text-white text-base font-medium"
            type="submit"
          >
            Continue
          </button>
        </form>
        <p
          className={`text-xs font-medium hover:underline underline-offset-4 text-center cursor-pointer text-blue-300`}
          onClick={handleResendOTP}
        >
          Resend Code
        </p>
      </div>
    </div>
  );
};

export default Otp;
