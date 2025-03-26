"use client";
import React,{useState} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from 'formik'
import axios from 'axios'
import { Notify } from 'notiflix'
import * as Yup from 'yup'
import { useRole } from "@/app/context/RoleContext";
import LoadingScreen from "@/app/components/loader/Loader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Navbar from "./Navbar";
const SignIn = () => {
  const router = useRouter()
  const { role } = useRole()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    router.push('/sign-up')
  }

  const formik = useFormik({
    initialValues: {
      email: '',
      password:''
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
    }),
    onSubmit: async (initialValues) => {
      try {
        setLoading(true)
        let url = ''
        if (role === 'patient') {
          url ='http://localhost:5000/api/patient/login'
        }
        else if (role === 'doctor') {
          url ='http://localhost:5000/api/doctor/login'
        }
        else {
          url ='http://localhost:5000/api/admin/login'
        }
        const response = await axios.post(url, {
          email: initialValues.email,
          password: initialValues.password,
        });

        if (response.status === 200) {
          setLoading(false)
          Notify.success("Credentials verified!");

          const { doctor, accessToken, refreshToken } = response.data

          sessionStorage.setItem('access_token', accessToken);
          sessionStorage.setItem('refreshtoken', refreshToken);

          if (doctor?.isFirstLogin === 'true') {
            router.push('/reset-password')
          }
          else {
            router.push('/otp')
          }

        } else {
          setLoading(false)
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error) {
        setLoading(false)
        if (error.response) {

          if (error.response.status === 401) {
            setLoading(false)
            console.log(error)
            Notify.failure(error.response.data.message || "Unauthorized: Invalid credentials.Try again");
          } else if (error.response.status === 400) {
            setLoading(false)
            Notify.failure(error.response.data.message || "Bad request.");
          } else {
            setLoading(false)
            Notify.failure(error.response.data.message || "An error occurred.");
          }
        } else {

          setLoading(false)
          console.error("Unexpected error:", error);
          Notify.failure("A network error occurred. Please try again later.");
        }
      }
    }
  })

  if (loading){
    return <LoadingScreen />
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-row justify-between space-y-20 gap-y-0.5">
        <div></div>
        <div className="border p-5 shadow-md rounded-md">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[34px] font-medium">Sign In</p>
            <p className="text-base text-gray-500 font-normal mb-5">
              Welcome back! Please enter your details.
            </p>
            <form onSubmit={formik.handleSubmit} className="">
              <label htmlFor="email" className="text-base font-normal">
                Email*
              </label>
              <br />
              <input
                name="email"
                type="email"
                className={`w-[400px] h-12 border rounded-md px-3 mt-2 mb-5 text-sm ${formik.touched.email && formik.errors.email ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="johndoe@gmail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
              <br />
              <label htmlFor="password" className="text-base font-normal w-80 pt-9">
                Password*
              </label>
              <br />
              <div className="relative w-full">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`w-full h-12 border rounded-md px-3 mt-2 mb-3 text-sm ${formik.touched.password && formik.errors.password ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus:outline-[#6B4DE6] placeholder:text-gray-500 pr-10`}
                  placeholder="Enter your password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span
                  className="absolute right-3 top-5 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </span>
              </div>

              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
              <br />
              <div className="flex justify-between my-1.5">

                <div className="" onClick={()=>router.push('/forgot-password')}>
                  <Link  className="text-xs font-medium underline underline-offset-4 text-gray-700" href="/send-email">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md mt-8 font-semibold transition-all hover:scale-105"
                type="submit"
              >
                Sign in
              </button>
            </form>
            {
              role === 'patient' && (
                <div className="mt-4 text-center">
                  <p className="text-sm">Don’t have an account ?</p>
                  <p className="text-sm text-[#6B4DE6] cursor-pointer hover:underline mt-1" onClick={handleSignUp}>Sign Up</p>
                </div>
              )
            }

          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default SignIn;
