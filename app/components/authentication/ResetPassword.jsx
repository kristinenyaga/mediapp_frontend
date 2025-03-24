"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik'
import axios from 'axios'
import { Notify } from 'notiflix'
import * as Yup from 'yup'
import { useRole } from "@/app/context/RoleContext";
import LoadingScreen from "@/app/components/loader/Loader";
import { AiOutlineLoading } from "react-icons/ai";
const ResetPassword = () => {
  const router = useRouter()
  const { role } = useRole()
  const [loading, setLoading] = useState(false)


  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: ''

    },
    validationSchema: Yup.object({
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        )
        .email("invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .max(64, "Password must not exceed 64 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/^\S*$/, "Password must not contain spaces")
        .notOneOf(["password", "123456", "qwerty", "abc123"], "Password is too common")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .min(6, "Password must be at least 6 characters long")
        .max(64, "Password must not exceed 64 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(/^\S*$/, "Password must not contain spaces")
        .notOneOf(["password", "123456", "qwerty", "abc123"], "Password is too common")
        .required("Confirm password is required"),

    }),
    onSubmit: async (initialValues) => {
      try {
        setLoading(true)
        let url = ''
        if (role === 'patient') {
          url = 'http://localhost:5000/api/patient/resetpassword'
        }
        else if (role === 'doctor') {
          url = 'http://localhost:5000/api/doctor/resetpassword'
        }
        else {
          url = 'http://localhost:5000/api/admin/resetpassword'
        }
        const response = await axios.post(url, {
          email: initialValues.email,
          password: initialValues.password,
        });
        if (response.status === 200) {
          setLoading(false)
          Notify.success("password reset successfully!");
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
          setLoading(false)
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error) {
        setLoading(false)
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.data) {
            Notify.failure("Error: " + error.response.data.error);
          } else {
            Notify.failure("Unexpected Axios error: " + error.message);
          }
        } else {
          Notify.failure("Unexpected error: " + error);
        }
        setLoading(false);
      }
    }
  })

  if(loading) return <LoadingScreen />

  return (
    <>
      <div className="flex flex-row justify-between space-y-32 gap-y-0.5">
        <div></div>
        <div>
          <div className="mb-6">
            <p className="text-[28px] font-medium">Reset Password</p>
            <p className="text-gray-600 text-sm mb-5">Create a New secure Password to Get Started</p>
            <form onSubmit={formik.handleSubmit} className="">
              <label htmlFor="email" className="text-sm font-normal">
                Email*
              </label>
              <input
                name="email"
                type="email"
                className={`w-full px-3 h-12 border rounded-md text-sm ${formik.touched.password && formik.errors.password ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="johndoe@gmail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 mt-2 text-xs">{formik.errors.email}</p>
              )}

              
              <label htmlFor="password" className="block mt-5 mb-2 text-sm font-normal w-80">
                New Password*
              </label>
              <input
                name="password"
                type="password"
                className={`w-full px-3 h-12 border rounded-md text-sm ${formik.touched.password && formik.errors.password ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mb-4 mt-2">{formik.errors.password}</p>
              )}
              <label htmlFor="confirmPassword" className="text-sm block mt-5 font-normal w-80">
                Confirm Password*
              </label>
              <input
                name="confirmPassword"
                type="password"
                className={`w-full px-3 h-12 border rounded-md mt-2 text-sm ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="confirm password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-2">{formik.errors.confirmPassword}</p>
              )}


              <button
                className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md font-semibold transition-all hover:scale-105 mt-10"
                type="submit"
              >
                {loading ? 'loading ...':'Submit'}
              </button>
            </form>
            {
              loading && (<p>Loading ... <AiOutlineLoading /></p>)
            }

          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default ResetPassword;
