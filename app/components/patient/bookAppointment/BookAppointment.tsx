"use client"
import React, { useState, useEffect } from 'react';
import PatientLayout from '../patientLayout';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';
import DoctorCard from './DoctorCard';
import api from '@/app/utils/axiosInstance';
import { useRole } from '@/app/context/RoleContext';

const BookAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDoctorRequired, setIsDoctorRequired] = useState(true);
  const [availableTimeslots, setAvailableTimeslots] = useState({
    morning: [],
    afternoon:[]
  });
  const [doctors, setDoctors] = useState([]);
  const router = useRouter()
  const { role } = useRole()
  

  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDateOptions();

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  useEffect(() => {
    const fetchTimeslots = async () => {
      if (selectedDate && (!isDoctorRequired || selectedDoctor)) {
        try {
          const response = await api.post(
            "/api/appointment/available-slots",
            {
              doctorId: isDoctorRequired ? selectedDoctor : null,
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
          const filteredSlots = slots.filter((slot) => {
            const slotTime = new Date(`${selectedDate}T${slot.startTime}`);
            return !isToday || slotTime >= minAllowedTime;
          });

          const morningSlots = filteredSlots.filter(
            (slot) => parseInt(slot.startTime.split(":")[0]) < 12
          );
          const afternoonSlots = filteredSlots.filter(
            (slot) => parseInt(slot.startTime.split(":")[0]) >= 12
          );


          setAvailableTimeslots({ morning: morningSlots, afternoon: afternoonSlots });
        } catch (error) {
          console.error("Error fetching timeslots:", error);
        }
      }
    };

    fetchTimeslots();
  }, [selectedDate, selectedDoctor, isDoctorRequired]);

  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const response = await api.get("/api/doctor", {
          _role: role
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAllDoctors();
  }, []);


  const handleSubmit = (e) => {
    e.preventDefault();

    const bookAppointment = async () => {
      console.log('triggered')
      const response = await api.post('/api/appointment/book', {
        date: selectedDate,
        selectedTime,
        doctorId:selectedDoctor
      },{
        _role: role
      })
      if (response.status === 201) {
        Notify.success("appointment booked successfully")
        router.push(`appointments/${response?.data?.appointment.id}`)
      }
    }
    bookAppointment()
  };

  return (
    <PatientLayout>
      <div className="bg-white">
        <div className="flex justify-between items-center border-b pb-6 mb-4">
          <div>
            <p className="text-2xl font-medium text-secondary mt-3">Book Appointment</p>
            <p className="text-sm text-gray-500">Please fill out the details below to book your next appointment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg mb-9">
            <label className="block text-gray-900 text-[16px]">Would you like to select a doctor?</label>
            <div className="flex items-center mt-2 space-x-4">
              <button
                type="button"
                onClick={() => setIsDoctorRequired(true)}
                className={`py-2 px-4 rounded-lg ${isDoctorRequired ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setIsDoctorRequired(false)}
                className={`py-2 px-4 rounded-lg ${!isDoctorRequired ? 'bg-secondary text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                No
              </button>
            </div>
          </div>

          {
            isDoctorRequired ? (
              <div className="bg-white shadow-sm rounded-lg py-4">
                <label className="block text-black text-xl mb-5">Available Doctors</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {doctors.map((doctor) => (
                    <DoctorCard
                      key={doctor.id}
                      doctor={doctor}
                      onSelect={(id) => setSelectedDoctor(id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Date Selection */}
                <div className="bg-white rounded-lg">
                  <label className="block text-gray-900 text-base">Select Date:</label>
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

                {/* Time Slot Selection */}
                {selectedDate && (
                  <div className="bg-white shadow-sm rounded-lg py-4">
                    <label className="block text-gray-900 text-base">Select Time:</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      <div className="w-full">
                        <p className="text-gray-700 pl-1 text-sm font-medium">Morning Hours</p>
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
                        <p className="text-gray-700 pl-1 text-sm font-medium">Afternoon Hours</p>
                        <select
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full p-3 mt-2 border rounded-lg"
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
                  )}
                  {
                    selectedDate && selectedTime && (
                      <div className="flex justify-center">
                        <button
                          type="submit"
                          className="bg-secondary text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                        >
                          Book Appointment
                        </button>
                      </div>
                    )
                  }
              </div>
            )
          }
        </form>
      </div>
    </PatientLayout>
  );
};

export default BookAppointment;
