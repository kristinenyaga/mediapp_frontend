"use client"
import React, { useState, useEffect } from 'react';
import PatientLayout from '../patientLayout';
import { Notify } from 'notiflix';
import { useRouter } from 'next/navigation';
import DoctorCard from './DoctorCard';
import api from '@/app/utils/axiosInstance';
import { useRole } from '@/app/context/RoleContext';
import SymptomSelector from '../appointments/SymptomSelector';
import LoadingScreen from '../../loader/Loader';
import { BsInfoCircle } from 'react-icons/bs';

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
  const [symptoms, setSymptoms] = useState([])
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const router = useRouter()
  const { role } = useRole()
  const [loading,setLoading] = useState(false)
  

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

  const formatDate = (date: number | Date | undefined) => {
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
    const fetchSymptoms = async () => {
      try {
        const response = await api.get('/api/symptoms', {
          _role: role
        });
        setSymptoms(response.data);
      } catch (error) {
        console.error('Error fetching symptoms:', error);
      }
    };
    fetchSymptoms()
  },[])

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


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/api/appointment/book', {
        date: selectedDate,
        selectedTime,
        doctorId: selectedDoctor,
      }, {
        _role: role
      });

      if (response.status === 201) {
        const appointmentId = response?.data?.appointment?.id;

        // Only call submitSymptoms if symptoms are selected
        if (selectedSymptoms.length > 0) {
          await submitSymptoms(appointmentId);
        }

        // Show success message & redirect regardless of symptoms
        Notify.success("Appointment booked successfully");
        router.push(`/patient/appointments/${appointmentId}`);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      Notify.failure("Failed to book appointment. Please try again.");
    }
  };

  const submitSymptoms = async (id) => {
    if (selectedSymptoms.length === 0) {
      return; // Prevents the API call when no symptoms are selected
    }
    const symptomList = selectedSymptoms?.map((symptom) => symptom.value); 
      try {
        const response = await api.post('/api/patientsymptoms/submit-symptoms', {
          appointmentId: id,
          symptoms: symptomList,
          additionalInfo: additionalInfo
        }, {
          _role: role
        })
        if (response.status === 200) {
          Notify.success("appointment booked successfully")
          router.push(`/patient/appointments/${id}`)
        }
        console.log(response.data)
      } catch (error) {
        console.log(error)
      }
  }
  
  const patientSymptoms: unknown = []

  if(loading) return <LoadingScreen />
  return (
    <PatientLayout>
      <div className="bg-white">
        <div className="border-b pb-4 mb-6">
          <h2 className="text-2xl font-medium text-blue-700">Doctors</h2>
          <p className="text-gray-500 text-sm">View the list of available doctors and select one to book an appointment with</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-lg mb-9">
            <div className="flex items-center gap-3">
              <BsInfoCircle className="text-blue-600 text-lg" />
              <p className="text-gray-700 text-sm">
                You can either <span className="font-medium text-blue-700">select a doctor</span> from the available list
                or <span className="font-medium text-blue-700">be assigned the next available doctor</span> for your appointment.
              </p>
            </div>

            <div className="flex items-center mt-4 space-x-4">
              {/* Option 1: Select a Specific Doctor */}
              <button
                type="button"
                onClick={() => setIsDoctorRequired(true)}
                className={`px-5 py-3 rounded-lg border transition shadow-sm ${isDoctorRequired
                    ? "border-blue-700 text-blue-700 border"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                Choose a Specific Doctor
              </button>

              {/* Option 2: Get Next Available Doctor */}
              <button
                type="button"
                onClick={() => setIsDoctorRequired(false)}
                className={`px-5 py-3 rounded-lg font-medium border transition shadow-sm ${!isDoctorRequired
                    ? "bg-blue-700 text-white border-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
              >
                Get Next Available Doctor
              </button>
            </div>
          </div>


          {
            isDoctorRequired ? (
              <div className="bg-white rounded-lg py-4">
                <label className="block text-gray-800 text-xl mb-5">Available Doctors</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-[90%]">
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
                <p className='mb-5 text-lg text-blue-600 font-medium'>Book Appointment</p>
                <div className="bg-white rounded-lg">
                  <label className="block text-gray-900 text-base">Select Date:</label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className=" w-[90%] p-3 mt-2 border border-gray-300 rounded-md outline-none focus:outline-none"
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
                    <label className="block text-gray-900 text-base mt-4">Select Time:</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 w-[90%]">
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
