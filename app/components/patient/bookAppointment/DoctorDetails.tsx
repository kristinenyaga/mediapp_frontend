"use client"
import React, { useEffect, useState } from 'react'
import PatientLayout from '../patientLayout'
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';
const DoctorDetails = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [availableTimeslots, setAvailableTimeslots] = useState({
      morning: [],
      afternoon:[]
    });
  const { id } = useParams()
  const doctorId = id
  const router = useRouter()

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
      if (selectedDate) {
        try {
          const response = await axios.post(
            "http://localhost:5000/api/appointment/available-slots",
            {
              doctorId,
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
  }, [selectedDate, doctorId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const bookAppointment = async () => {
      console.log('triggered')
      const response = await axios.post('http://localhost:5000/api/appointment/book', {
        date: selectedDate,
        selectedTime,
        doctorId
      }, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }
      })
      if (response.status === 201) {
        Notify.success("appointment booked successfully")
        router.push(`/patient/appointments/${response?.data?.appointment.id}`)
      }
    }
    bookAppointment()
  };
  return (
    <PatientLayout>
      <div className='flex items-center gap-10 w-[100%]'>
        <div className='w-[20%] hidden h-[25vh] bg-gray-200 rounded-lg flex justify-center items-center'>
          KN
        </div>
        <div className='w-[70%] h-[25vh] rounded-lg border border-gray-300 p-5'>
          <p className='text-[22px] font-medium text-gray-700'>Dr. Kristine Nyaga</p>
          <p className=' text-blue-600 text-[18px]'>General Practioner</p>

          <div className='flex items-center gap-1 text-xs mt-2 border text-gray-500 border-gray-300 w-[170px] pl-4 p-1 rounded-full'>
            <p>5+</p>
            <p>years of experience</p>
          </div>
          <p className='text-xs text-black mt-4 font-semibold'>About</p>
          <p className='text-[14px] max-w-[80%] mt-2'>Dr. Jane Doe is a highly experienced cardiologist with over 15 years of
            experience in diagnosing and treating heart-related conditions. She is
            passionate about providing personalized care to her patients.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className='mt-10 w-[93%]'>
          {/* Date Selection */}
          <p className='text-blue-600 text-[20px] font-medium mb-5'>Book Appointment</p>
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
              <div className="flex justify-center mt-10">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
                >
                  Book Appointment
                </button>
              </div>
            )
          }
        </div>
      </form>
    </PatientLayout>
  )
}

export default DoctorDetails