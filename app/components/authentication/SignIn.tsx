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
const SignIn = () => {
  const router = useRouter()
  const { role } = useRole()
  const [loading,setLoading] = useState(false)

  const handleSignUp = () => {
    router.push('/sign-up')
  }

  // formik validation
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
        .min(4, "Password must be greater than 4 characters")
        .required("Password is required")
    }),
    onSubmit: async (initialValues) => {
      try {
        // Make API call
        setLoading(true)
        const url = role === 'patient' ? "http://localhost:5000/api/patient/login" :"http://localhost:5000/api/doctor/login"
        const response = await axios.post(url, {
          email: initialValues.email,
          password: initialValues.password,
        });

        console.log(response.data)
        // Handle success
        if (response.status === 200) {
          setLoading(false)
          router.push('/otp')
          Notify.success("Credentials verified!");
          // Store the JWT token in sessionStorage
          const { accessToken } = response.data;
          sessionStorage.setItem('access_token', accessToken); 
        } else {
          setLoading(false)
          Notify.failure(response.data.message || "Login failed");
        }
      } catch (error:any) {
        // Check if error response exists
        if (error.response) {
          console.error("Error response data:", error.response.data);

          if (error.response.status === 401) {
            setLoading(false)
            Notify.failure(error.response.data.message || "Unauthorized: Invalid credentials.");
          } else if (error.response.status === 400) {
            setLoading(false)
            Notify.failure(error.response.data.message || "Bad request.");
          } else {
            setLoading(false)
            Notify.failure(error.response.data.message || "An error occurred.");
          }
        } else {
          // Handle network errors or unexpected issues
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
      <div className="flex flex-row justify-between space-y-32 gap-y-0.5">
        <div></div>
        <div>
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[28px] font-medium">Sign In</p>
            <p className="text-xs text-gray-500 font-normal mb-5">
              Welcome back! Please enter your details.
            </p>
            <form onSubmit={formik.handleSubmit}>
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
              <div className="flex justify-between my-3.5">
                <div className="hidden">
                  <input
                    name="checkbox"
                    type="checkbox"
                    className="w-3	h-3	rounded-sm border-gray-400 mr-2 "
                  />
                  <label htmlFor="checkbox" className="text-xs font-normal ">
                    Remember me
                  </label>
                </div>
                <div className="">
                  <Link className="text-xs font-medium underline underline-offset-4 text-gray-700" href="/send-email">
                    Forgot password?
                  </Link>
                </div>
              </div>
              <button
                className="bg-blue-300 rounded-[8px] w-[400px] h-12 text-white text-base font-medium mt-2"
                type="submit"
              >
                Sign in
              </button>
            </form>
            {
              role === 'patient' && (
                <div className="mt-5 flex items-center gap-1 justify-center text-[14px]">
                  <p>Don&apos;t have an account ?</p>
                  <p className="hover:underline underline-offset-4 cursor-pointer text-blue-300" onClick={() => handleSignUp()}>Sign Up</p>
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
