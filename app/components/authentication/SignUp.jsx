"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Notify } from "notiflix";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup' 
import dayjs from 'dayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import LoadingScreen from "../loader/Loader";
import Navbar from "./Navbar";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const SignUp = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const max = dayjs().subtract(17, 'year');
  const min = dayjs().subtract(75, 'year');
  const [loading, setLoading] = useState(false)


  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName:'',
      email: '',
      password: '',
      confirmPassword:'',
      dob:max.format("YYYY-MM-DD"),
      gender:''
      
    },
    validationSchema: Yup.object({
  firstName: Yup.string()
    .matches(/^[a-zA-Z ]*$/, "First name must only contain letters")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .required("First name is required"),
  lastName: Yup.string()
    .matches(/^[a-zA-Z ]*$/, "Last name must only contain letters")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .required("Last name is required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address")
        .email("invalid email address")
        .required("email is required"),
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
        .required("Confirm Password is required"),
    }),
    onSubmit: async (initialValues) => {
console.log("Submitting Form with Values:", initialValues);
      try {
        setLoading(true)
      
        const response = await axios.post(
          "http://localhost:5000/api/patient/signup", {
            firstName: initialValues.firstName,
            lastName:initialValues.lastName,
            email: initialValues.email,
            password: initialValues.password,
            dob: initialValues.dob,
            gender:initialValues.gender
          }
        )

        if (response.status === 201) {
          setLoading(false)
          Notify.success("Sign Up successful")
          router.push('/sign-in')
        }
        else {
          setLoading(false)
          Notify.failure(response.data.message || "Sign up failed")
        }
      }
      catch (error) {
        setLoading(false)
        if (error.response) {

          if (error.response.status === 401) {
            Notify.failure(error.response.data.message || "Unauthorized: Invalid credentials.");
          } else if (error.response.status === 400) {
            Notify.failure(error.response.data.message || "Bad request.");
          } else {
            Notify.failure(error.response.data.message || "An error occurred.");
          }
        } else {
          setLoading(false)
          Notify.failure("A network error occurred. Please try again later.");
        }
      }
    }
  })

  if (loading) return <LoadingScreen />
  
  return (
    <>
      <Navbar />
      <div className="flex flex-row justify-between gap-y-0.5 p-5 ">
        <div></div>
        <div className="shadow-md rounded-md border p-5">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[34px] font-medium">Sign Up</p>
            <p className="text-base text-gray-500 font-normal mb-5">
              Get started with us !
            </p>
            <form onSubmit={formik.handleSubmit} className="">
              <div className="flex items-center gap-5">
                <div>
              <label htmlFor="firstName" className="text-base font-normal">
                First Name*
              </label>
              <br />
              <input
                name="firstName"
                type="text"
                className={`w-full h-12 border rounded-md px-3 mt-2 mb-1 text-sm ${formik.touched.firstName && formik.errors.firstName ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="Enter your firstName"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.firstName && formik.errors.firstName && (
                <p className="text-red-500 text-sm">{formik.errors.firstName}</p>
              )}
                </div>
                <div>
              <label htmlFor="firstName" className="text-base font-normal">
                Last Name*
              </label>
              <br />
              <input
                name="lastName"
                type="text"
                className={`w-full h-12 border rounded-md px-3 mt-2 mb-1 text-sm ${formik.touched.lastName && formik.errors.lastName ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="Enter your lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.lastName && formik.errors.lastName && (
                <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
              )}
                </div>
              </div>
              <br/>
              <label htmlFor="email" className="text-base font-normal">
                Email*
              </label>
              <br />
              <input
                name="email"
                type="email"
                className={`w-full h-12 border rounded-md px-3 mt-2 mb-1 text-sm ${formik.touched.email && formik.errors.email ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="johndoe@gmail.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
              <br />
        <div className="relative ">
          <label className="text-base font-normal">Password*</label>
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            className={`w-full h-12 border rounded-md px-3 mt-2 text-sm ${formik.touched.password && formik.errors.password ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus:outline-[#6B4DE6] placeholder:text-gray-500 pr-10`}
            placeholder="Enter your password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span
            className="absolute right-3 top-11 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
          )}
              </div>
              <div className="relative mt-5">
                
          <label className="text-base font-normal">Confirm Password*</label>
          <input
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            className={`w-full h-12 border rounded-md px-3 mt-2 text-sm ${formik.touched.confirmPassword && formik.errors.confirmPassword ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus:outline-[#6B4DE6] placeholder:text-gray-500 pr-10`}
            placeholder="Confirm your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <span
            className="absolute right-3 top-11 cursor-pointer text-gray-500"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </span>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</p>
          )}
        </div>
     
              <br />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer components={["DatePicker"]}>
                  <DemoItem
                    label="Date Of Birth*"
                    sx={{
                      "& .MuiFormLabel-root": {
                        fontSize: "16px", 
                        fontWeight: "500",
                        color: "#000",
                      },
                    }}
                  >
                    <div className="w-full">
                      <DatePicker
                        defaultValue={max}
                        maxDate={max}
                        minDate={min}
                        views={["year", "month", "day"]}
                        value={dayjs(formik.values.dob)}
                        onChange={(date) => formik.setFieldValue("dob", date?.format("YYYY-MM-DD"))}
                        slotProps={{
                          textField: {
                            variant: "outlined",
                            size: "small",
                            sx: {
                              width: "100%",
                              height: "48px", // ✅ Matches other input fields
                              "& .MuiInputBase-root": {
                                height: "48px", // ✅ Ensures consistent height
                                overflow: "hidden", // ✅ Removes scrollbar issue
                              },
                              "& .MuiOutlinedInput-root": {
                                height: "48px", // ✅ Matches input styling
                                overflow: "hidden", // ✅ Ensures no scrollbars
                              },
                              "& input": {
                                height: "48px", // ✅ Proper input height
                                padding: "10px 14px", // ✅ Matches spacing of other fields
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </DemoItem>
                </DemoContainer>
              </LocalizationProvider>



              <FormControl>
                <FormLabel sx={{
                  color: '#6B4DE6',
                  '&.Mui-checked': {
                    color: '#6B4DE6',
                  },
                }} id="demo-radio-buttons-group-label" className="font-normal mt-7 w-80 text-black text-base">Gender*</FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                  value={formik.values.gender}
                  onChange={(event) => formik.setFieldValue("gender", event.target.value)}

                >
                  <FormControlLabel value="female" control={<Radio sx={{
                    color: '#6B4DE6',
                    '&.Mui-checked': {
                      color: '#6B4DE6',
                    },
                  }} />} label="Female" />
                  <FormControlLabel value="male" control={<Radio sx={{
                    color: '#6B4DE6',
                    '&.Mui-checked': {
                      color: '#6B4DE6',
                    },
                  }} />} label="Male" />
                  <FormControlLabel value="other" control={<Radio sx={{
                    color: '#6B4DE6',
                    '&.Mui-checked': {
                      color: '#6B4DE6',
                    },
                  }} />} label="Other" />
                </RadioGroup>
              </FormControl>

              <button
                className="w-full bg-gradient-to-r from-[#6B4DE6] to-[#927de7] text-white h-12 rounded-md mt-8 font-semibold transition-all hover:scale-105"
                type="submit"
              >
                Sign up
              </button>
            </form>
            <div className="mt-5 text-center items-center gap-1 justify-center text-[14px]">
              <p>Already have an account ?</p>
              <p className="hover:underline underline-offset-4 cursor-pointer text-[#6B4DE6] mt-1" onClick={() => router.push('/sign-in')}>Sign In</p>
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </>
  );
};

export default SignUp;
