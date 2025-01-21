'use client';
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import { useParams } from 'next/navigation';
import axios from 'axios';

const AppointmentDetails = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/appointment/${id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
        });
        setAppointment(response.data.appointment);
      } catch (error) {
        console.error('Error fetching appointment details:', error);
      }
    };
    fetchAppointment();
  }, [id]);

  if (!appointment) return <p>Loading...</p>;

  const {
    date,
    startTime,
    endTime,
    appointmentDuration,
    status,
    doctor: { username, email, phone },
  } = appointment;

  const handleCancel = () => {
    // Handle cancel logic (could involve an API call to update the appointment status to 'cancelled')
    alert('Appointment has been cancelled');
  };

  const handleUpdate = () => {
    // Navigate to the update page or open a modal for editing
    alert('Redirect to update page');
  };

  return (
    <PatientLayout>
      <div className="">
        <div className='flex justify-between w-[95%] items-center'>
          <div className='flex items-center gap-5'>
            <h1 className="text-2xl font-medium text-blue-600">Appointment Details</h1>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 border border-gray-400 text-sm text-gray-600 hover:text-white rounded-md hover:bg-blue-600"
            >
              Update Appointment
            </button>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 bg-red-500 text-white text-sm rounded-md font-semibold hover:bg-red-600"
          >
            Cancel Appointment
          </button>
        </div>


        {/* Appointment Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-7 pl-1">
          <div className="text-gray-700">
            <p className="font-medium text-base text-gray-500">Appointment Date</p>
            <p className='mt-2'>{date}</p>
          </div>
          <div className="text-gray-700">
            <p className="font-medium text-base text-gray-500">Start Time</p>
            <p className='mt-2'>{startTime}</p>
          </div>
          <div className="text-gray-700">
            <p className="font-medium text-base text-gray-500">End Time</p>
            <p className='mt-2'>{endTime}</p>
          </div>
          <div className="text-gray-700">
            <p className="font-medium text-base text-gray-500">Duration</p>
            <p className='mt-2'>{appointmentDuration} minutes</p>
          </div>
          <div className="text-gray-700">
            <p className="font-medium text-base text-gray-500">Status</p>
            <p
              className={`${status === 'pending'
                  ? 'text-yellow-600'
                  : status === 'confirmed'
                    ? 'text-green-600'
                    : 'text-red-600'
                } font-medium mt-2`}
            >
              {status}
            </p>
          </div>
        </div>

        {/* Doctor Information */}
        <h2 className="text-lg font-medium text-blue-600 mb-4">Doctor Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
          <div className="text-gray-700">
            <p className="font-medium text-base text-gray-500">Doctor's Name</p>
            <p className='mt-2'>{username}</p>
          </div>

        </div>

      </div>
    </PatientLayout>
  );
};

export default AppointmentDetails;
