"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Notify } from "notiflix";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from 'yup' 
import dayjs, { Dayjs } from 'dayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRole } from "@/app/context/RoleContext";
import { LOADIPHLPAPI } from "dns/promises";
import LoadingScreen from "../loader/Loader";

const SignUp = () => {
  const router = useRouter()
  const [gender, setGender] = React.useState('');
  const [dob, setDob] = React.useState<Dayjs | null>(dayjs('2007-01-01'));

  const max = dayjs().subtract(18, 'year');
  const min = dayjs().subtract(75, 'year');
  const [loading, setLoading] = useState(false)
  const { role } = useRole()


  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGender((event.target as HTMLInputElement).value);
  };
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      dob: max.format("2007-01-01"),
      gender:'female'
      
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
        setLoading(true)
      
        const response = await axios.post(
          "http://localhost:5000/api/patient/signup" , {
            username: initialValues.username,
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
      catch (error: any) {
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
      <div className="flex flex-row justify-between space-y-14 gap-y-0.5 p-5 ">
        <div></div>
        <div className="shadow-md rounded-md border p-5">
          <div className="mb-6 flex flex-col gap-2">
            <p className="text-[34px] font-medium">Sign Up</p>
            <p className="text-base text-gray-500 font-normal mb-5">
              Get started with us !
            </p>
            <form onSubmit={formik.handleSubmit} className="">
              <label htmlFor="username" className="text-base font-normal">
                Username*
              </label>
              <br />
              <input
                name="username"
                type="username"
                className={`w-[400px] h-12 border rounded-md px-3 mt-2 mb-5 text-sm ${formik.touched.username && formik.errors.username ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="Enter your username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-sm">{formik.errors.username}</p>
              )}
              <br />
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
              <label htmlFor="password" className="text-base font-normal w-80">
                Password*
              </label>
              <br />
              <input
                name="password"
                type="password"
                className={`w-[400px] h-12 border rounded-md px-3 mt-2 mb-5 text-sm ${formik.touched.password && formik.errors.password ? "border-red-500 focus:outline-red-500" : "border-gray-400"} focus: outline-[#6B4DE6] placeholder:text-gray-500`}
                placeholder="Enter your password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm mt-2">{formik.errors.password}</p>
              )}
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
                    <div className="w-[400px]">
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
                Sign in
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
