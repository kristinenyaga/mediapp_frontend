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
import { BsPencilSquare, BsTrash } from 'react-icons/bs';

const AppointmentDetails = () => {
  const { id } = useParams(); 
  const [appointment, setAppointment] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole()
  const [open, setOpen] = useState(false)
  const handleClose =() => {
    setOpen(false)
  }

  const fetchAppointment = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/api/appointment/${id}`, {
        _role: role
      });
      setAppointment(response.data);
    } catch (error) {
      console.error('Error fetching appointment details:', error);
    } finally {
      setIsLoading(false); // Ensure loading is stopped regardless of success or failure
    }
  };

  useEffect(() => {
    console.log('triggered')
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
  }, [id,role]);

  const handleCancel = async () => {
    const response = await axios.delete(`http://localhost:5000/api/appointment/${id}`)
    console.log(response.data)
  };

  const handleUpdate = () => {
    setOpen(true)
  };


  if (isLoading && !appointment) return <LoadingScreen />;
  console.log(appointment)

  const formatTime = (timestring) => {
    if (!timestring) return "N/A"; 
    const [hours, minutes] = timestring.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const patientSymptoms = appointment?.patientSymptom?.symptoms 
  const symptomId = appointment?.patientSymptom?.id
  return (
    <PatientLayout>
      <div className="max-w-[90%]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-blue-700">Appointment Details</h1>
          <div className="flex gap-3">
            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <BsPencilSquare /> Update
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              <BsTrash /> Cancel
            </button>
          </div>
        </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-4">
        <InfoItem status={''} title="Appointment Date" content={appointment?.date ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(appointment?.date)) : "N/A"} />
        <InfoItem status={''} title="Appointment Time" content={appointment?.startTime && appointment?.endTime ? `${formatTime(appointment?.startTime)} - ${formatTime(appointment?.endTime)}` : "N/A"} />
        <InfoItem title="Status" content={appointment?.status} status={appointment?.status} />
        <InfoItem title="Doctor" status={''} content={`${appointment?.doctor?.username} - Room ${appointment?.doctor?.room_number}`} />
      </div>

      {/* Symptoms */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-3">Symptoms</h2>
        <div className="flex flex-wrap gap-2">
          {appointment?.patientSymptom?.symptoms.length > 0 ? (
            appointment?.patientSymptom?.symptoms.map((symptom, index) => (
              <span key={index} className="px-3 py-1 bg-gray-200 rounded-md text-gray-800 text-sm">
                {symptom?.name}
              </span>
            ))
          ) : (
            <p className="text-gray-500 flex items-center gap-2">
              <CiNoWaitingSign className="text-lg" /> No symptoms reported
            </p>
          )}
        </div>
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
const InfoItem = ({ title, content, status }) => {
  let statusColor = "text-gray-600";
  if (status === "pending") statusColor = "text-yellow-600";
  if (status === "confirmed") statusColor = "text-green-600";
  if (status === "canceled") statusColor = "text-red-600";

  return (
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-2 text-lg font-medium ${status ? statusColor : "text-gray-800"}`}>{content}</p>
    </div>
  );
};
export default AppointmentDetails;
