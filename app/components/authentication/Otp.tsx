"use client";
import React, { useRef } from "react";
import { useFormik } from "formik";
import { Notify } from "notiflix";
import * as Yup from 'yup'
import axios, { AxiosError } from "axios";
const Otp = () => {
  const inputRefs = useRef([])
  type ErrorResponse = {
    error: string;
  };
  const formik = useFormik({
    initialValues: {
      otp:new Array(6).fill("")
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(
          Yup.string()
            .required("Required")
        )
        .required("OTP is required"),
    }),
    onSubmit: async (values) => {
      const otpCode = values.otp.join(""); // Join OTP array into a single string
      console.log("Entered OTP:", otpCode);

      try {
        // Send OTP to the server for verification
        const response = await axios.post("http://localhost:5000/api/patient/verifyotp", {
          code: otpCode,
        });

        // Handle successful response
        if (response.status === 200) {
          Notify.success("OTP Verified successfully!");
          // Redirect or perform additional actions here
        } else {
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error) {
        // Handle Axios errors specifically
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError<ErrorResponse>;
          if (axiosError.response && axiosError.response.data) {
            console.error("Error:", axiosError.response.data.error);
            Notify.failure(axiosError.response.data.error);
          } else {
            console.error("Unexpected Axios error:", axiosError.message);
            Notify.failure("Something went wrong. Please try again.");
          }
        } else {
          // Handle non-Axios errors (unexpected errors)
          console.error("Unexpected error:", error);
          Notify.failure("Something went wrong. Please try again.");
        }
      }
    }

  })
  const handleInputChange = (index, value) => {
    if (/^[a-zA-Z0-9]$/.test(value) || value === "") {
      const newOtp = [...formik.values.otp];
      newOtp[index] = value;
      formik.setFieldValue("otp", newOtp);

      // Automatically focus the next field
      if (value !== "" && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };


  return (
    <div className="flex flex-col items-center space-y-32 mt-36 gap-y-8">
      <div>
        <p className="text-2xl font-medium mb-5">Two-Factor Authentication</p>
        <div className="text-[14px] font-normal mb-6 text-gray-700">
          <span>We&apos;ve sent a 6-digit code to </span>
          <span className="font-medium text-blue-300">johndoe@gmail.com</span>.
          <div className="mt-3 text-center">Please enter the code below.</div>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="flex flex-row space-x-3 mb-6">
            {formik.values.otp.map((value, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                maxLength="1"
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
        <p className="text-xs font-medium hover:underline underline-offset-4 text-center cursor-pointer">
          Resend code
        </p>
      </div>
    </div>
  );
};

export default Otp;
