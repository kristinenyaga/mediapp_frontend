"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Notify } from "notiflix";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup' 

const SignUp = () => {
  const router = useRouter()

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password:''
    },
    validationSchema: Yup.object({
      username: Yup.string()
      .required("username is required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
      )
        .email("invalid email address")
        .required("email is required"),
      password: Yup.string()
        .min(6, "Password must be greater than 6 characters")
      .required("password is required")
    }),
    onSubmit: async (initialValues) => {
      try {
        const response = await axios.post(
          "http://localhost:5000/api/patient/signup" , {
            username: initialValues.username,
            email: initialValues.email,
            password:initialValues.password
          }
        )

        if (response.status === 201) {
          Notify.success("Sign Up successful")
          router.push('/sign-in')
        }
        else {
          Notify.failure(response.data.message || "Sign up failed")
        }
      }
      catch(error:any) {
        if (error.response) {

          if (error.response.status === 401) {
            Notify.failure(error.response.data.message || "Unauthorized: Invalid credentials.");
          } else if (error.response.status === 400) {
            Notify.failure(error.response.data.message || "Bad request.");
          } else {
            Notify.failure(error.response.data.message || "An error occurred.");
          }
        } else {
          Notify.failure("A network error occurred. Please try again later.");
        }
      }
    }
  })

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
            <form onSubmit={formik.handleSubmit}>
              <label htmlFor="username" className="text-xs font-normal">
                Username*
              </label>
              <br />
              <input
                name="username"
                type="username"
                className={`w-[400px] h-[50px] border outline-none rounded-md px-2 placeholder:text-sm text-sm text-gray-700 mb-2 ${formik.touched.username && formik.errors.username
                  ? "border-red-500"
                  : "border-gray-700"
                  }`}
                placeholder="Enter your username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-xs">{formik.errors.username}</p>
              )}
              <br />
              <label htmlFor="email" className="text-xs font-normal">
                Email*
              </label>
              <br />
              <input
                name="email"
                type="email"
                className={`w-[400px] h-[50px] border outline-none rounded-md px-2 placeholder:text-sm text-sm text-gray-700 mb-2 ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-gray-700"
                  }`}
                placeholder="johndoe@gmail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs">{formik.errors.email}</p>
              )}
              <br />
              <label htmlFor="password" className="text-xs font-normal w-80 pt-5">
                Password*
              </label>
              <br />
              <input
                name="password"
                type="password"
                className={`w-[400px] h-[50px] border outline-none rounded-md px-2 text-sm placeholder:text-sm ${formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-gray-700"
                  }`}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-xs mt-2">{formik.errors.password}</p>
              )}
              <br />
              <button
                className="bg-blue-300 rounded-[8px] w-[400px] h-12 text-white text-base font-medium mt-8"
                type="submit"
              >
                Sign in
              </button>
            </form>
            <div className="mt-5 flex items-center gap-1 justify-center text-[14px]">
              <p>Already have an account ?</p>
              <p className="hover:underline underline-offset-4 cursor-pointer text-blue-300" onClick={() => router.push('/sign-in')}>Sign In</p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default SignUp;
