"use client";
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import { useRouter } from 'next/navigation';
import api from '@/app/utils/axiosInstance';
import { useRole } from '@/app/context/RoleContext';
const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();
  const { role } = useRole()
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get('/api/appointment/patient-appointments', {
          _role:role
        });
        setAppointments(response.data.appointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      }
    };
    fetchAppointments();
  }, []);

  const handleAppointmentClick = (id) => {
    router.push(`appointments/${id}`);
  };
  const formatTime = (timestring) => {
    const [hours, minutes] = timestring.split(':')
    const date = new Date
    date.setHours(hours,minutes,0)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  return (
    <PatientLayout>
      <div className="w-[95%]">
        <h1 className="text-2xl font-medium text-secondary"> Appointments</h1>
        <p className='text-gray-500 mb-10'>These are all your appointments</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {appointments.map((appointment,index) => (
            <div
              key={appointment.id}
              className="cursor-pointer bg-white rounded-lg p-4 border border-gray-300 hover:border-secondary transition duration-200 ease-in-out"
              onClick={() => handleAppointmentClick(appointment.id)}
            >
              <div className="flex flex-col">
                <h2 className="text-[18px] ">Appointment {index+1}</h2>
                <p className="text-sm text-secondary font-medium mt-3">{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(appointment.date))}</p>
                <p className="text-sm mt-2 text-gray-500 font-medium">{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
                <p
                  className={`text-sm mt-4 border w-[100px] pl-5 p-2 rounded-md bg-yellow-50 font-semibold ${appointment.status === 'pending'
                      ? 'text-yellow-600'
                      : appointment.status === 'confirmed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                >
                  {appointment.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PatientLayout>
  );
};

export default Appointment;
