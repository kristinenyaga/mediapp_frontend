"use client"
import React, { useState, useEffect } from 'react';
import PatientLayout from '../patientLayout';
import axios from 'axios';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';
const BookAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isDoctorRequired, setIsDoctorRequired] = useState(false);
  const [availableTimeslots, setAvailableTimeslots] = useState({
    morning: [],
    afternoon:[]
  });
  const [doctors, setDoctors] = useState([]);
  const router = useRouter()

  // Mock timeslots for each doctor
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

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };
  useEffect(() => {
    const fetchTimeslots = async () => {
      if (selectedDate && (!isDoctorRequired || selectedDoctor)) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/appointment/available-slots",
            {
              doctorId: isDoctorRequired ? selectedDoctor : null,
              date: selectedDate,
            },
            {
              headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
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
  // Fetch available doctors on component mount
  useEffect(() => {
    const fetchAllDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/doctor", {
          headers: { Authorization: `Bearer ${sessionStorage.getItem("access_token")}` },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchAllDoctors();
  }, []);


  // Fetch available timeslots

  console.log(availableTimeslots)
  const handleSubmit = (e) => {
    e.preventDefault();

    const bookAppointment = async () => {
      const response = await axios.post('http://localhost:5000/api/appointment/book', {
        date: selectedDate,
        selectedTime,
        doctorId:selectedDoctor
      }, {
        headers:{Authorization:`Bearer ${sessionStorage.getItem('access_token')}`}
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
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6 mb-4">
          <div>
            <p className="text-2xl font-medium text-blue-600">Book Appointment</p>
            <p className="text-sm text-gray-500">Please fill out the details below to book your next appointment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Ask if Doctor is Required */}
          <div className="bg-white rounded-lg mb-9">
            <label className="block text-gray-900 text-[16px]">Would you like to select a doctor?</label>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={isDoctorRequired}
                onChange={() => setIsDoctorRequired(!isDoctorRequired)}
                className="mr-2"
              />
              <span className="text-gray-600 text-sm">Yes, I want to select a doctor.</span>
            </div>
          </div>

          {/* Select Date */}
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

          {/* Select Doctor (if required) */}
          {isDoctorRequired && selectedDate && (
            <div className="bg-white shadow-sm rounded-lg py-4">
              <label className="block text-gray-900 text-base">Select Doctor:</label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-3 mt-2 border rounded-lg outline-none focus:outline-none"
              >
                <option value="">Choose a Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Select Time */}
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

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </PatientLayout>
  );
};

export default BookAppointment;
