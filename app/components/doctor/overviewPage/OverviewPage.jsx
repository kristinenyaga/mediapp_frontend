"use client";
import React, { useEffect, useState } from "react";
import DoctorLayout from "../doctorLayout";
import Header from "../Header";
import { FaCalendarCheck } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import api from "@/app/utils/axiosInstance";
import LoadingScreen from "../../loader/Loader";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc"; // Import the UTC plugin
import timezone from "dayjs/plugin/timezone"; // (Optional) If needed

// Extend dayjs with UTC support
dayjs.extend(utc);
dayjs.extend(timezone); // (Optional) If needed

const OverviewPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [filter, setFilter] = useState("thisWeek");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const [loading, setIsLoading] = useState(false);
  const [diagnoses, setDiagnoses] = useState([])
  
  useEffect(() => {
    setIsLoading(true);
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/api/appointment/doctor-appointments");
        setAppointments(response.data);

      const today = new Date().toISOString().split("T")[0]; 

      const upcoming = response.data
        .filter((appt) => appt.date >= today) // Include today & future
        .sort((a, b) => {
          // Sort by date first, then by start time
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() === dateB.getTime()) {
            return a.startTime.localeCompare(b.startTime);
          }
          return dateA - dateB;
        })
        .slice(0, 5);

        setUpcomingAppointments(upcoming)

        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    const fetchDiagnoses = async () => {
      try {
        const response = await api.get("/api/diagnosis/");
        setDiagnoses(response.data.data);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDiagnoses();
    fetchAppointments();
  }, []);

  console.log('diagnoses',diagnoses)

  const getFilteredData = () => {
    let filteredData = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Get Sunday of the current week
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Get Saturday of the same week

    if (filter === "today") {
      filteredData = appointments.filter(
        (appt) => new Date(appt.date).toDateString() === today.toDateString()
      );
    } else if (filter === "thisWeek") {
      filteredData = appointments.filter(
        (appt) => {
          const appointmentDate = new Date(appt.date);
          return appointmentDate >= startOfWeek && appointmentDate <= endOfWeek;
        }
      );
    } else if (filter === "otherMonths") {
      filteredData = appointments.filter(
        (appt) =>
          new Date(appt.date).getMonth() === selectedMonth.month() &&
          new Date(appt.date).getFullYear() === selectedMonth.year()
      );
    }
    return filteredData;
  };

  const filteredAppointments = getFilteredData();
  const completedAppointments = filteredAppointments.filter((appt) => appt.status === "completed");
  const pendingAppointments = filteredAppointments.filter((appt) => appt.status === "pending");
  const cancelledAppointments = filteredAppointments.filter((appt) => appt.status === "cancelled");

  const getUniquePatients = () => {
    const uniquePatients = new Set();
    filteredAppointments.forEach((appt) => uniquePatients.add(appt.patient?.id));
    return uniquePatients.size;
  };
  const totalPatients = getUniquePatients();

  const getAppointmentTrendsData = () => {
    let groupedData = {};

    if (filter === "today") {
      const todayName = new Date().toLocaleString("en-us", { weekday: "long" });
      groupedData[todayName] = filteredAppointments.length;
    } else if (filter === "thisWeek") {
      // Initialize days of the week with zero counts
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      daysOfWeek.forEach((day) => (groupedData[day] = 0));

      // Group appointments by weekday
      filteredAppointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const dayName = appointmentDate.toLocaleString("en-us", { weekday: "short" });
        groupedData[dayName] = (groupedData[dayName] || 0) + 1;
      });
    } else if (filter === "otherMonths") {
      groupedData = { "1-7": 0, "8-14": 0, "15-21": 0, "22-28": 0, "29-31": 0 };

      filteredAppointments.forEach((appointment) => {
        const dayOfMonth = new Date(appointment.date).getDate();

        if (dayOfMonth <= 7) groupedData["1-7"]++;
        else if (dayOfMonth <= 14) groupedData["8-14"]++;
        else if (dayOfMonth <= 21) groupedData["15-21"]++;
        else if (dayOfMonth <= 28) groupedData["22-28"]++;
        else groupedData["29-31"]++;
      });
    }

    return Object.keys(groupedData).map((key) => ({
      period: key,
      appointments: groupedData[key],
    }));
  };

  if (loading) return <LoadingScreen />;
  const formatTime = (timestring) => {
    if (!timestring) return "N/A";
    const [hours, minutes] = timestring.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

const getMostCommonPredictedDiagnoses = () => {
  const diagnosisCounts = {};

  // Get today's date in UTC
  const today = dayjs().utc();
  const startOfWeek = today.startOf("week"); // Sunday
  const endOfWeek = today.endOf("week"); // Saturday

  const relevantDiagnoses = diagnoses.filter((diagnosis) => {
    const diagnosisDate = dayjs(diagnosis.createdAt).utc(); // Convert `createdAt` to UTC

    if (filter === "today") {
      return diagnosisDate.isSame(today, "day");
    } else if (filter === "thisWeek") {
      return diagnosisDate.isAfter(startOfWeek) && diagnosisDate.isBefore(endOfWeek);
    } else if (filter === "otherMonths") {
      return (
        diagnosisDate.month() === selectedMonth.month() &&
        diagnosisDate.year() === selectedMonth.year()
      );
    }
    return true;
  });

  relevantDiagnoses.forEach((diagnosis) => {
    const predicted = diagnosis.predictedDiagnosis;
    if (predicted) {
      diagnosisCounts[predicted] = (diagnosisCounts[predicted] || 0) + 1;
    }
  });

  return Object.keys(diagnosisCounts).map((key) => ({
    diagnosis: key,
    count: diagnosisCounts[key],
  }));
};

  console.log('filter', filter)
  console.log('diagnoses',getMostCommonPredictedDiagnoses())
            
  console.log(('upcomging',upcomingAppointments))
  return (
    <DoctorLayout>
      <Header />

      <div className="mt-8">
        <div className="flex gap-3 items-center mb-5">
          <select
            className="px-3 py-3.5 bg-white border border-gray-300 focus:outline-none rounded text-gray-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="thisWeek">This Week</option>
            <option value="otherMonths">Other Months</option>
          </select>

          {filter === "otherMonths" && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={["year", "month"]}
                value={selectedMonth}
                onChange={(date) => setSelectedMonth(date)}
                disableFuture
                format="MMMM YYYY"
                className="w-40"
              />
            </LocalizationProvider>
          )}
        </div>
        <div className="flex gap-5 justify-between w-[100%] xl:w-[90%] pr-5">
          {[
            { label: "Upcoming Appointments", value: pendingAppointments.length, color: "text-blue-700" },
            { label: "Completed Appointments", value: completedAppointments.length, color: "text-green-600" },
            { label: "Cancelled Appointments", value: cancelledAppointments.length, color: "text-red-500" },
            { label: "Total Patients", value: totalPatients, color: "text-blue-300" },
          ].map((stat, index) => (
            <div key={index} className="flex justify-between h-24 px-5 items-center border border-gray-300 w-[400px] rounded-md">
              <div className={`flex gap-5 items-center px-2 ${stat.color}`}>
                <div className="flex justify-center items-center rounded-full w-14 h-14 bg-gray-200">
                  <FaCalendarCheck className="text-2xl" />
                </div>
                <p className="text-sm font-medium">{stat.label}</p>
              </div>
              <p className="text-gray-700 text-2xl pr-2">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 w-[90%]">
          <GraphCard title="Appointment Trends Over Time">
            <ResponsiveContainer width="90%" height={250}>
              <LineChart data={getAppointmentTrendsData()}>
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="appointments" stroke="#6B4DE6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </GraphCard>

          <GraphCard title="Most Common Predicted Diagnoses">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={getMostCommonPredictedDiagnoses()} margin={{ bottom: 40 }}>
                <XAxis 
                  dataKey="diagnosis" 
                  angle={-30} // Rotate labels for better fit
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6B4DE6" />
              </BarChart>
            </ResponsiveContainer>
          </GraphCard>

 
        </div>
        <div className="bg-white w-[90%] rounded-xl p-4">
          <h2 className="text-lg text-gray-700 mb-5">Upcoming Appointments</h2>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-gray-700">
                <th className="p-2">Patient</th>
                <th className="p-2">Date</th>
                <th className="p-2">Time</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAppointments.map((appt, index) => (
                <tr key={index} className="border-b text-sm text-gray-600">
                  <td className="p-2">{appt.patient.username}</td>
                  <td className="p-2">{new Date(appt.date).toLocaleDateString()}</td>
                  <td className="p-2">{formatTime(appt?.startTime)} - {formatTime(appt?.endTime)}</td>
                  <td className="p-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${appt.status === "Confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))}
              {upcomingAppointments.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-3 text-center text-gray-500">
                    No upcoming appointments
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DoctorLayout>
  );
};

const GraphCard = ({ title, children }) => (
  <div className="bg-white rounded-md mt-10">
    <h3 className="text-gray-700 text-lg mb-3">{title}</h3>
    {children}
  </div>
);

export default OverviewPage;
