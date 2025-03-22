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
import { useDoctor } from '@/app/context/doctorContext';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
const BookAppointment = () => {
 
  const [selectedDate, setSelectedDate] = useState(null); 
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
  const [loading, setLoading] = useState(false)
  const { selectedDoctor, setDoctorId } = useDoctor()

  const handleDoctorSelection = (id) => {
    setDoctorId(id); 
  };
  const selectedDoctorDetails = selectedDoctor
    ? doctors.find((doctor) => doctor.id === parseInt(selectedDoctor))
    : null;

  useEffect(() => {
    const fetchTimeslots = async () => {
      if (selectedDate && (!isDoctorRequired || selectedDoctor)) {
        try {
          const response = await api.post(
            "/api/appointment/available-slots",
            {
              doctorId: isDoctorRequired ? selectedDoctor : null,
              date: new Date(selectedDate).toISOString().split("T")[0], // Ensure proper date format
            },
            {
              _role: role
            }
          );

          const slots = response.data.slots || [];
          const currentDateTime = new Date();

          const selectedDateTime = new Date(selectedDate);

          const isToday = selectedDateTime.toDateString() === currentDateTime.toDateString();

          // Calculate the minimum allowed time (30 minutes from now)
          const minAllowedTime = new Date(currentDateTime.getTime() + 30 * 60 * 1000);

          // Convert slots to actual Date objects for comparison
          const filteredSlots = slots.filter((slot) => {
            const [hours, minutes] = slot.startTime.split(":").map(Number);
            const slotTime = new Date(selectedDateTime); // Clone selected date
            slotTime.setHours(hours, minutes, 0, 0); // Set correct hours and minutes


            return !isToday || slotTime >= minAllowedTime; // Exclude past slots if it's today
          });


          // Separate morning and afternoon slots
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
        <div className="pb-4 mb-4">
          <h2 className="text-2xl font-medium text-blue-700">Book Appointment</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!selectedDoctor && (
            <div className="bg-white rounded-lg mb-9">
              <div className="flex items-center gap-3">
                <BsInfoCircle className="text-blue-600 text-lg" />
                <p className="text-gray-700 text-sm">
                  You can either <span className="font-medium text-blue-700">select a doctor</span> from the available list
                  or <span className="font-medium text-blue-700">be assigned the next available doctor</span> for your appointment.
                </p>
              </div>

              <div className="flex items-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={() => setIsDoctorRequired(true)}
                  className={`px-5 py-3 rounded-lg border transition shadow-sm ${isDoctorRequired ? "border-blue-700 text-blue-700 border" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  Choose a Specific Doctor
                </button>

                <button
                  type="button"
                  onClick={() => setIsDoctorRequired(false)}
                  className={`px-5 py-3 rounded-lg font-medium border transition shadow-sm ${!isDoctorRequired ? "bg-blue-700 text-white border-blue-700" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  Get Next Available Doctor
                </button>
              </div>
            </div>
          )}

          {/* If a doctor is selected, show details */}
          {selectedDoctor ? (
            
            <div className="border w-[90%] p-4 mt-4 bg-gray-100 rounded-lg">

              <p className="text-lg font-medium">Dr. {selectedDoctorDetails?.username}</p>
              <p className="text-gray-600">{selectedDoctorDetails?.specialization}</p>
            </div>
          ) : isDoctorRequired ? (
            <div>
              <label className="block text-gray-700 text-base font-medium mb-2">Select a Doctor:</label>
              <select
                onChange={(e) => handleDoctorSelection(e.target.value)}
                  className=" w-[90%] p-3 mt-2 border bg-white border-gray-300 rounded-md outline-none focus:outline-none"
              >
                <option value="">Select a doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.username} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          ) : null}
          <div>
            {
              selectedDoctorDetails && (
                <div className="bg-white rounded-lg">
                  <div>
                    <label className="block text-gray-700 text-base font-medium mb-2">Select Date:</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date)}
                        disablePast
                        format="DD MMM YYYY"
                        className="w-[90%]"
                      />
                    </LocalizationProvider>
                  </div>
                </div>
              )
            }

            {selectedDate && (
              <div className="bg-white shadow-sm rounded-lg py-4">
                <label className="block text-gray-900 text-base mt-4">Select Time:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4 w-[90%]">
                  <div className="w-full">
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 bg-white border-gray-300 border rounded-md focus:outline-none"
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
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full p-3 bg-white border-gray-300 border rounded-md focus:outline-none"
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

        </form>
      </div>
    </PatientLayout>
  );
};

export default BookAppointment;
