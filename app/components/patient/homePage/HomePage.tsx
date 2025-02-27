"use client";
import React, { useEffect, useState } from "react";
import { FiCalendar } from "react-icons/fi";
import PatientLayout from "../patientLayout";
import { FaCheck } from "react-icons/fa";
import { BsArrowUpRight } from "react-icons/bs";
import api from "@/app/utils/axiosInstance";
import { useRole } from "@/app/context/RoleContext";
import { useRouter } from "next/navigation";
const HomePage = () => {
  const [appointments, setAppointments] = useState([])
  const [nextAppointment, setNextAppointment] = useState(null);
  const [lastAppointment, setLastAppointment] = useState(null);
  const [previousVisits, setPreviousVisits] = useState([]);
  const { role } = useRole()
  const router = useRouter()
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/appointment/patient-appointments', {
          _role: role
        });
        setAppointments(response.data.appointments);

        let fetchedAppointments = response.data.appointments || []

        fetchedAppointments = fetchedAppointments.map(appointment => ({
          ...appointment,
          date: new Date(appointment.date)
          
        })).sort((a, b) => a.date - b.date)

        const today = new Date()
        const upcomingAppointment = fetchedAppointments.filter((appointment) => appointment.date >= today)
        const pastAppointment = fetchedAppointments.filter(appointment => appointment.date <= today)

        console.log(upcomingAppointment)
        
        setLastAppointment(pastAppointment[pastAppointment.length - 1] || null)
        setNextAppointment(upcomingAppointment[0] || null)
        setPreviousVisits(pastAppointment.reverse().slice(0, 5))
        
        setAppointments(fetchedAppointments)
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, []);
console.log(appointments)
  return (
    <PatientLayout>
      <div className="w-[95%] min-h-screen">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium text-blue-700">
              Welcome Back, Kristine
            </h1>
            <p className="text-gray-500 text-sm">
              Here&apos;s a quick overview of your medical history.
            </p>
          </div>

          <button className="bg-gradient-to-r from-blue-600 to-blue-900 hover:scale-105 transition text-white px-6 py-3 text-sm font-medium rounded-full flex items-center gap-2 shadow-md" onClick={()=>router.push('/patient/book-appointment')}>
            <FiCalendar size={16} />
            Book Appointment
          </button>
        </header>
        <div>
        </div>

        <section className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-5 rounded-lg shadow-sm">
              <h2 className="text-blue-700 font-medium mb-3">Queue Information</h2>
              <div className="space-y-2 text-gray-700 text-[15px]">
                <div className="flex justify-between">
                  <p>Queue Number</p>
                  <span className="text-blue-700 font-semibold">#10</span>
                </div>
                <div className="flex justify-between">
                  <p>Current Position</p>
                  <span className="text-blue-700 font-semibold">5</span>
                </div>
                <div className="flex justify-between">
                  <p>People Ahead</p>
                  <span className="text-blue-700 font-semibold">4</span>
                </div>
              </div>
            </div>

            <div className="bg-brand-100 p-5 rounded-lg shadow-sm">
              <p className="text-gray-800">Next Appointment</p>
              {nextAppointment ? (
                <>
                  <p className="text-green-600 text-xl font-semibold mt-2">
                    {new Intl.DateTimeFormat("en-US", {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }).format(new Date(nextAppointment.date))}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">{nextAppointment.room_number}</p>
                  <button className="mt-4 text-green-600 text-sm font-medium flex items-center gap-2">
                    View details <BsArrowUpRight />
                  </button>
                </>
              ) : (
                <p className="text-gray-600 text-sm mt-2">No upcoming appointments</p>
              )}
            </div>

            <div className="bg-yellow-50 p-5 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-gray-800">Last Appointment</p>
                <p className="text-sm flex gap-2 items-center text-yellow-700">{lastAppointment?.status} <FaCheck /></p>
              </div>
              {
                lastAppointment ? (
                  <>
                    <p className="text-yellow-700 text-xl font-semibold mt-2">{new Intl.DateTimeFormat("en-US", {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    }).format(lastAppointment?.date)}</p>
                    <p className="text-gray-600 text-xs mt-1">{lastAppointment?.doctor?.username}</p>
                  </>
                ) : (
                    <p className="text-gray-600 text-sm mt-2">No previous appointments</p>

                )
              }
            </div>

            <div className="bg-purple-50 p-5 rounded-lg shadow-sm">
              <p className="text-gray-800">Total Appointments</p>
              <p className="text-purple-700 text-xl font-bold">{appointments?.length}</p>
              <p className="text-gray-600 text-xs mt-1">Since 2024</p>
            </div>
          </div>
        </section>
        <section className="mt-8">
          <h2 className="text-lg text-gray-800 mb-4">Previous Visits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-800 text-sm rounded-lg overflow-hidden">
              <thead className="bg-gray-50 text-gray-800 text-sm">
                <tr>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Time</th>
                  <th className="py-4 px-6">Doctor</th>
                  <th className="py-4 px-6">Room</th>

                </tr>
              </thead>
              <tbody>
                {previousVisits?.map((appointment, index) => (
                  <tr
                    key={appointment.id}
                    className={`border-b border-gray-200 ${index % 2 !== 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-gray-100 transition`}
                  >
                    <td className="px-6 py-3">{new Date(appointment.date).toDateString()}</td>
                    <td className="px-6 py-3">{`${appointment.startTime} - ${appointment.endTime}`}</td>
                    <td className="px-6 py-3">{appointment.doctor.username}</td>
                    <td className="px-6 py-3">{appointment.room_number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </PatientLayout>

  );
};

export default HomePage;
