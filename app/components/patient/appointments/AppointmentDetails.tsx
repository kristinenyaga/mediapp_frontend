'use client';
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import { useParams } from 'next/navigation';
import LoadingScreen from '../../loader/Loader';
import api from '@/app/utils/axiosInstance';
import { useRole } from '@/app/context/RoleContext';
import UpdateAppointment from './UpdateAppointment';
import { CiNoWaitingSign } from "react-icons/ci";
import axios from 'axios';

const AppointmentDetails = () => {
  const { id } = useParams(); 
  const [appointment, setAppointment] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole()
  const [open,setOpen] = useState(false)

  const handleClose =() => {
    setOpen(false)
  }

  const fetchAppointment = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/api/appointment/${id}`, {
        _role: role
      });
      setAppointment(response.data.appointment);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {


    const fetchSymptoms = async () => {
      try {
        const response = await api.get('/api/symptoms', {
          _role: role
        });
        setSymptoms(response.data);
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error('Error fetching symptoms:', error);
      }
    };

    fetchAppointment();
    fetchSymptoms();
  }, [id]);

  const handleCancel = async () => {

    const response = await axios.delete(`http://localhost:5000/api/appointment/${id}`)
    console.log(response.data)

  };

  const handleUpdate = () => {
    setOpen(true)
  };


  if (isLoading && !appointment) return <LoadingScreen />;

  if (!appointment) {
    return (
      <PatientLayout>
        <div className="text-center text-gray-500">No appointment details available.</div>
      </PatientLayout>
    );
  }
  const formatTime = (timestring) => {
    const [hours, minutes] = timestring.split(':')
    const date = new Date
    date.setHours(hours, minutes, 0)
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  const patientSymptoms = appointment?.patientSymptom?.symptoms 
  const symptomId = appointment?.patientSymptom?.id
  return (
    <PatientLayout>
      <div className="max-w-[90%]">
        <div className="flex justify-between w-[95%] items-center">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-medium text-secondary">Appointment Details</h1>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 border border-gray-400 text-sm text-gray-600 hover:text-white rounded-md hover:bg-secondary"
              
            >
              Update Appointment
            </button>
          </div>
          <button
            onClick={handleCancel}
            className="px-4 py-2.5 bg-red-300 text-white text-sm rounded-md font-semibold hover:bg-red-600"
          >
            Cancel Appointment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-7 pl-1 border-b border-gray-200 p-4">
          <div>
            <p className="text-base ">Appointment Date</p>
            <p className="mt-3 text-gray-600">{new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(appointment?.date))}</p>
          </div>
          <div>
            <p className="text-base ">Appointment Time</p>
            <p className="mt-3 text-gray-600">{formatTime(appointment?.startTime)} - {formatTime(appointment?.endTime)}</p>
          </div>
          <div>
            <p className="text-base ">Status</p>
            <p
              className={`${appointment?.status === 'pending'
                ? 'text-yellow-600'
                : appointment?.status === 'confirmed'
                  ? 'text-green-600'
                  : 'text-red-600'
                } font-medium mt-2`}
            >
              {appointment?.status}
            </p>
          </div>
          <div>
            <p className="text-base">Doctor</p>
            <p className="mt-3 text-gray-600">
              {appointment?.doctor?.username} <span className="text-secondary font-medium">- room 7</span>
            </p>
          </div>
        </div>
      </div>
      <div className=''>
        <p className='mb-5'>Symptoms</p>
        {
          patientSymptoms ? (patientSymptoms.map((symptom, index) => (
            <div key={index} className='mt-2 text-gray-600 border-b border-gray-300 w-fit list-disc'>
              <p>{symptom.name}</p>
            </div>
          ))) : (<p className='text-red-200 text-sm flex items-center gap-2'><CiNoWaitingSign className='font-bold'/>no symptoms</p>)

        }
      </div>
      <UpdateAppointment
        open={open}
        handleClose={handleClose}
        date={appointment?.date}
        role={role}
        doctor={appointment?.doctorId}
        symptoms={symptoms}
        patientSymptoms={patientSymptoms}
        appointmentId={id}
        symptomId={symptomId}
        refreshData={fetchAppointment}
      />
    </PatientLayout>
  );
};

export default AppointmentDetails;
