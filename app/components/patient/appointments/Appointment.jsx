"use client";
import React, { useEffect, useState } from "react";
import PatientLayout from "../patientLayout";
import { useRouter } from "next/navigation";
import api from "@/app/utils/axiosInstance";
import { useRole } from "@/app/context/RoleContext";
import { handleDownloadPDF } from "./handledownload";
import { MdEventBusy } from "react-icons/md";
import { useAuth } from "@/app/context/authContext";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { RiCloseFill } from "react-icons/ri";

const Appointment = () => {
  const [appointments, setAppointments] = useState([]); // ✅ All appointments
  const [filteredAppointments, setFilteredAppointments] = useState([]); // ✅ Displayed appointments
  const [statusFilter, setStatusFilter] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null, // ✅ Default: No date selected
      endDate: null,
      key: "selection",
    },
  ]);

  const router = useRouter();
  const { role } = useRole();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/api/appointment/patient-appointments", {
          _role: role,
        });
        setAppointments(response.data.appointments); // ✅ Store all appointments
        setFilteredAppointments(response.data.appointments); // ✅ Initially display all
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  // ✅ **Filter Appointments when Filters Change**
  useEffect(() => {
    let filtered = [...appointments];

    // ✅ **Filter by Status**
    if (statusFilter) {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // ✅ **Filter by Doctor Name**
    if (searchDoctor) {
      filtered = filtered.filter((apt) =>
        apt.doctor.username.toLowerCase().includes(searchDoctor.toLowerCase())
      );
    }

    // ✅ **Filter by Date Range (Only if selected)**
    const { startDate, endDate } = dateRange[0];
    if (startDate && endDate) {
      filtered = filtered.filter((apt) => {
        const aptDate = new Date(apt.date);
        return aptDate >= startDate && aptDate <= endDate;
      });
    }

    // ✅ **Sort Order**
    if (sortOrder === "latest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    setFilteredAppointments(filtered);
  }, [statusFilter, searchDoctor, sortOrder, dateRange, appointments]);

  const handleDateRange = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const handleClearButton = () => {
    setDateRange([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);
  };

  const handleAppointmentClick = (id) => {
    router.push(`appointments/${id}`);
  };

  const formatTime = (timestring) => {
    if (!timestring) return "N/A";
    const [hours, minutes] = timestring.split(":");
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  return (
    <PatientLayout>
      <div className="w-[95%] p-[4px]">
        <div className="border-b pb-4 mb-6 flex gap-10 items-center">
          <div>
            <h2 className="text-3xl font-medium text-blue-700">Appointments</h2>
            <p className="text-gray-500 text-base mt-1">Here are all your appointments</p>
          </div>
          {filteredAppointments.length > 0 && (
            <button
              onClick={() => handleDownloadPDF(filteredAppointments, user, { sortOrder, searchDoctor, statusFilter,dateRange })}
              className="border border-blue-700 py-2 px-3 text-base text-blue-700 rounded-lg"
            >
              Download Report
            </button>
          )}
        </div>

        {appointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg p-6 shadow-md">
            <MdEventBusy className="text-blue-700 text-6xl" />
            <h2 className="text-lg font-semibold text-gray-800 mt-4">No Appointments Found</h2>
            <p className="text-gray-600 text-center mt-2">
              You don’t have any booked appointments at the moment. <br />
              Book one now to get started.
            </p>
            <button
              onClick={() => router.push("patient/book-appointment")}
              className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-md shadow-md hover:bg-secondary-dark transition"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-4 mb-6 items-center">
              {/* ✅ Date Picker Button */}
              <button onClick={() => setShowDatePicker(!showDatePicker)} className="border text-sm p-2 py-3 rounded-md bg-blue-600 text-white">
                Select Date Range
              </button>

              {showDatePicker && (
                <div className="absolute z-10 bg-white shadow-lg rounded-md p-4 top-16">
                  <DateRange ranges={dateRange} onChange={handleDateRange} moveRangeOnFirstSelection={false} rangeColors={["#3b82f6"]} />
                  <div className="flex justify-between">
                    <button className="mt-2 flex items-center w-full text-center text-red-600" onClick={() => setShowDatePicker(false)}>
                      Close <RiCloseFill className="text-lg" />
                    </button>
                    <button className="mt-2 flex items-center w-full text-center text-blue-700" onClick={handleClearButton}>
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <select className="border text-base bg-white border-gray-400 text-gray-800 p-2 py-2.5 rounded-md focus:outline-none transition" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <input
                type="text"
                placeholder="Search doctor..."
                className="border border-gray-400 placeholder:text-gray-800 placeholder:text-base text-base text-gray-700 p-2 py-2.5 rounded-md focus:outline-none transition"
                value={searchDoctor}
                onChange={(e) => setSearchDoctor(e.target.value)}
              />

              <select className="border text-base bg-white py-2.5 border-gray-400 text-gray-800 p-2 rounded-md focus:outline-none transition" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
  {filteredAppointments.length > 0 ? (
    filteredAppointments.map((appointment, index) => (
      <div key={appointment.id} className="cursor-pointer bg-white rounded-lg p-4 border border-gray-300 hover:border-blue-700 transition duration-200 ease-in-out flex items-start justify-between py-5" onClick={() => handleAppointmentClick(appointment.id)}>
        <div>
          <h2 className="text-[17px] font-medium text-gray-700">Appointment {index + 1}</h2>
          <p className="text-[15px] text-gray-600 ">Dr. {appointment.doctor.username}</p>
          <p className="text-[14px] text-blue-700 font-medium mt-3">
            {new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }).format(new Date(appointment.date))}
          </p>
          <p className="text-[14px] text-gray-500 mt-1">
            {formatTime(appointment?.startTime)} - {formatTime(appointment?.endTime)}
          </p>
        </div>

        <p
          className={`px-3 text-sm py-1 rounded-md
            ${appointment.status === 'completed' ? ' text-brand-500 bg-brand-100' :
              appointment.status === 'cancelled' ? ' text-red-500 bg-red-50' :
                'text-amber-600 bg-amber-50'
            }
          `}
        >
          {appointment.status}
        </p>
      </div>
    ))
  ) : (
    // **Display Message when no appointments match filters**
    <div className="w-full col-span-3 flex flex-col items-center justify-center bg-gray-100 rounded-lg p-6 shadow-md">
      <MdEventBusy className="text-blue-700 text-6xl" />
      <h2 className="text-lg font-medium text-gray-800 mt-4">
        No Appointments match the search
      </h2>
    </div>
  )}
</div>

          </>
        )}
      </div>
    </PatientLayout>
  );
};

export default Appointment;
