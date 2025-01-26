'use client';
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import { useParams } from 'next/navigation';
import axios from 'axios';
import SymptomSelector from './SymptomSelector';
import LoadingScreen from '../../loader/Loader';

const AppointmentDetails = () => {
  const { id } = useParams(); // Use for client-side routing
  const [appointment, setAppointment] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState();
  const data =
  {
    "symptoms": [
      "fever",
      "cough",
      "headache",
      "fatigue",
      "shortness of breath",
      "nausea",
      "rash",
      "chills"
    ]
  }
  const username = 'Dr. Smith';

  useEffect(() => {
    const fetchAppointment = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/appointment/${id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
        });
        setAppointment(response.data.appointment);
      } catch (error) {
        console.error('Error fetching appointment details:', error);
        setIsLoading(false);
      }
    };

    const fetchSymptoms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/symptoms');
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

  const handleCancel = () => {
    alert('Appointment has been cancelled');
  };

  const handleUpdate = () => {
    alert('Redirect to update page');
  };

  const onSubmit = (symptomInfo) => {
    console.log(symptomInfo.symptomList);
    const submitSymptoms = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/patientsymptoms/submit-symptoms', {
          appointmentId: id,
          symptoms: symptomInfo.symptomList,
          additionalInfo: symptomInfo.additionalInfo
        })
        console.log(response.data)
      } catch (error) {

      } 
    }
    submitSymptoms()
  };

  if (isLoading) return <LoadingScreen />;

  if (!appointment) {
    return (
      <PatientLayout>
        <div className="text-center text-gray-500">No appointment details available.</div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="max-w-[90%]">
        <div className="flex justify-between w-[95%] items-center">
          <div className="flex items-center gap-5">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-7 pl-1 border-b border-gray-200 p-4">
          <div>
            <p className="text-base text-gray-500">Appointment Date</p>
            <p className="mt-3">{appointment?.date}</p>
          </div>
          <div>
            <p className="text-base text-gray-500">Appointment Time</p>
            <p className="mt-3">{`${appointment?.startTime} - ${appointment?.endTime}`}</p>
          </div>
          <div>
            <p className="text-base text-gray-500">Status</p>
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
            <p className="text-base text-gray-500">Doctor</p>
            <p className="mt-3">
              {username} <span className="text-blue-600 font-medium">- room 7</span>
            </p>
          </div>
        </div>
      </div>
      {symptoms && <SymptomSelector symptoms={symptoms} onSubmit={onSubmit} />}
    </PatientLayout>
  );
};

export default AppointmentDetails;
