"use client"
import React, { useState,useEffect } from 'react'
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { Formik, Form, Field } from "formik";
import api from '@/app/utils/axiosInstance';
import { MdWarning, MdWarningAmber } from 'react-icons/md';
import SymptomSelector from './SymptomSelector';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
const UpdateAppointment = ({ open, handleClose, date, role, doctor, symptoms, patientSymptoms, appointmentId, symptomId, refreshData }) => {

  const getValidDate = (date) => {
    const parsedDate = date ? new Date(date) : null;
    return parsedDate 
  };

  const [selectedDate, setSelectedDate] = useState(getValidDate(date));

  const [selectedTime, setSelectedTime] = useState('')
  const [selectedDoctor,setSelectedDoctor] = useState(doctor)
  const [availableTimeslots, setAvailableTimeslots] = useState({
      morning: [],
      afternoon:[]
  });
  const updatedPatientSymptoms = patientSymptoms?.map((symptom: { name: any; id: any; }) => ({
    label: symptom.name,
    value:symptom.id
  }))
  const [selectedSymptoms, setSelectedSymptoms] = useState(updatedPatientSymptoms || []);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const router = useRouter()
  
  const getDateOptions = () => {
    const dates = []
    const today = new Date()
    for (let i = 0; i < 3; i++){
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    return dates
  }
  const dates = getDateOptions()

  const formatDate = (date: number | Date | undefined) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' }
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  useEffect(() => {
    const fetchTimeslots = async () => {
        try {
          const response = await api.post(
            "/api/appointment/available-slots",
            {
              doctorId: selectedDoctor?selectedDoctor : null,
              date: selectedDate,
            }, {
            _role: role
          }
          );
          const slots = response.data.slots || [];
          const currentTime = new Date();
          const isToday = new Date(selectedDate).toDateString() === currentTime.toDateString();

          // Add 30 minutes to the current time
          const minAllowedTime = new Date(currentTime.getTime() + 30 * 60 * 1000);

          // Filter slots based on the minimum allowed time
          const filteredSlots = slots.filter((slot: { startTime: any; }) => {
            const slotTime = new Date(`${selectedDate}T${slot.startTime}`);
            return !isToday || slotTime >= minAllowedTime;
          });

          const morningSlots = filteredSlots.filter(
            (slot: { startTime: string; }) => parseInt(slot.startTime.split(":")[0]) < 12
          );
          const afternoonSlots = filteredSlots.filter(
            (slot: { startTime: string; }) => parseInt(slot.startTime.split(":")[0]) >= 12
          );


          setAvailableTimeslots({ morning: morningSlots, afternoon: afternoonSlots });
        } catch (error) {
          console.error("Error fetching timeslots:", error);
        }
    }
    if (selectedDate !== '') {
      fetchTimeslots()
    }

  }, [selectedDate]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const updateAppointment = async () => {

      const response = await api.patch(`/api/appointment/${appointmentId}`, {
        date: selectedDate,
        selectedTime,
      }, {
        _role: role
      })
      if (response.status === 200 && selectedSymptoms) {
        submitSymptoms()
      }
    }
    updateAppointment()
  };

  const submitSymptoms = async () => {
    const symptomList = selectedSymptoms?.map((symptom: { value: any; }) => symptom.value);
    try {
      let response;
      if (patientSymptoms) {
        response = await api.patch(`/api/patientsymptoms/${symptomId}`, {
          symptoms: symptomList,
          additionalInfo: additionalInfo
        }, {
          _role: role
        })
      }
      else {
        response = await api.post('/api/patientsymptoms/submit-symptoms', {
          appointmentId,
          symptoms: symptomList,
          additionalInfo: additionalInfo
        }, {
          _role: role
        })
      }
      if (response.status === 200) {
        Notify.success("appointment updated successfully")
        refreshData()
        handleClose()

      }

    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box sx={style}>
        <Typography id="modal-title" variant='h6' component='h2' >Update Appointment</Typography>
        <p className='flex gap-2 items-center text-sm text-amber-600 mt-2'><MdWarning className='text-amber-600' /> you can not change the selected doctor</p>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-lg mt-8">
            <label className="block text-gray-900 text-base">Select Date</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg outline-none focus:outline-none"
            >
              <option value="">Choose a Date</option>
              {dates.map((date, index) => (
                <option key={index} value={date.toISOString().split('T')[0]}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>
          {selectedDate && (
            <div>
              <div className="bg-white shadow-sm rounded-lg py-4 mt-5">
                <label className="block text-gray-900 text-base">Select Time</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <div className="w-full">
                    <p className="text-gray-500 pl-1 text-sm font-medium">Morning Hours</p>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 mt-2 border rounded-lg"
                    >
                      <option value="">Select a Morning Slot</option>
                      {availableTimeslots.morning.map((slot, index) => (
                        <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                          {slot.startTime} - {slot.endTime}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <p className="text-gray-500 pl-1 text-sm font-medium">Afternoon Hours</p>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 mt-2 border rounded-lg "
                    >
                      <option value="">Select an Afternoon Slot</option>
                      {availableTimeslots.afternoon.map((slot, index) => (
                        <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                          {slot.startTime} - {slot.endTime}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className=''>
                {symptoms && <SymptomSelector
                  symptoms={symptoms}
                  patientSymptoms={patientSymptoms}
                  selectedSymptoms={selectedSymptoms}
                  setSelectedSymptoms={setSelectedSymptoms}
                  additionalInfo={additionalInfo}
                  setAdditionalInfo={setAdditionalInfo}
                />}
              </div>

            </div>

          )}
          {
            selectedDate && selectedTime && (
              <div className="">
                <button
                  type="submit"
                  className="bg-secondary mt-5 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                  update Appointment
                </button>
              </div>
            )
          }
        </form>
      </Box>
    </Modal>
  )
}

export default UpdateAppointment