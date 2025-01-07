"use client"
import React, { useState } from 'react';
import PatientLayout from '../patientLayout';

const BookAppointment = () => {
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [morningDisabled, setMorningDisabled] = useState(false);
  const [eveningDisabled, setEveningDisabled] = useState(false);

  const doctors = [
    { id: '1', name: 'Dr. Smith' },
    { id: '2', name: 'Dr. Johnson' },
  ];

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

  const timeSlots = {
    morning: ['09:00 AM', '10:00 AM', '11:00 AM'],
    evening: ['02:00 PM', '03:00 PM', '04:00 PM'],
  };

  const formatDate = (date) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
  };

  const handleTimeChange = (time, period) => {
    setSelectedTime(time);

    if (period === 'morning') {
      setEveningDisabled(!!time);
    } else if (period === 'evening') {
      setMorningDisabled(!!time);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Booking Details:', { selectedDoctor, selectedDate, selectedTime });
    alert('Appointment booked successfully!');
  };

  return (
    <PatientLayout>
      <div className="bg-white">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <p className="text-xl font-semibold text-blue-600">
              Book Appointment
            </p>
            <p className="text-sm text-gray-500">Please fill out the details below to book your next appointment</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Doctor */}
          <div className="bg-white  rounded-lg">
            <label className="block text-gray-700">Select Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg outline-none focus:outline-none "
              required
            >
              <option value="">Choose a Doctor</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Date */}
          <div className="bg-white shadow-sm rounded-lg">
            <label className="block text-gray-700">Select Date:</label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-3 mt-2 border rounded-lg outline-none focus:outline-none"
              required
            >
              <option value="">Choose a Date</option>
              {dates.map((date, index) => (
                <option key={index} value={date.toISOString().split('T')[0]}>
                  {formatDate(date)}
                </option>
              ))}
            </select>
          </div>

          {/* Select Time */}
          {selectedDate && (
            <div className="bg-white shadow-sm rounded-lg py-4 ">
              <label className="block text-gray-700">Select Time:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                <div className="w-full">
                  <p className="font-medium text-gray-700">Morning:</p>
                  <select
                    value={morningDisabled ? '' : selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value, 'morning')}
                    className="w-full p-3 mt-2 border rounded-lg outline-none focus:outline-none"
                    disabled={morningDisabled}
                  >
                    <option value="">Choose a Morning Slot</option>
                    {timeSlots.morning.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <p className="font-medium text-gray-700">Afternoon:</p>
                  <select
                    value={eveningDisabled ? '' : selectedTime}
                    onChange={(e) => handleTimeChange(e.target.value, 'evening')}
                    className="w-full p-3 mt-2 border rounded-lg shadow-sm "
                    disabled={eveningDisabled}
                  >
                    <option value="">Choose an Afternoon Slot</option>
                    {timeSlots.evening.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
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
