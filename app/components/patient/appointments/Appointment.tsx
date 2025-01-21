"use client";
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointment/patient-appointments', {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
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

  return (
    <PatientLayout>
      <div className="">
        <h1 className="text-2xl font-medium text-blue-600"> Appointments</h1>
        <p className='text-gray-500 mb-7'>These are all you scheduled appointments</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="cursor-pointer bg-white rounded-lg p-4 border border-gray-300 hover:border-blue-500 transition duration-200 ease-in-out"
              onClick={() => handleAppointmentClick(appointment.id)}
            >
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold text-gray-800">{appointment.doctor.username}</h2>
                <p className="text-sm text-gray-500">Date: {appointment.date}</p>
                <p className="text-sm text-gray-500">Time: {appointment.startTime} - {appointment.endTime}</p>
                <p
                  className={`text-sm font-semibold ${appointment.status === 'pending'
                      ? 'text-yellow-600'
                      : appointment.status === 'confirmed'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                >
                  Status: {appointment.status}
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
