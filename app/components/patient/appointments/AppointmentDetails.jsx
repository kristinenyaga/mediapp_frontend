'use client';
import React, { useEffect, useState } from 'react';
import PatientLayout from '../patientLayout';
import { useParams } from 'next/navigation';
import LoadingScreen from '../../loader/Loader';
import api from '@/app/utils/axiosInstance';
import { useRole } from '@/app/context/RoleContext';
import UpdateAppointment from './UpdateAppointment';
import { CiNoWaitingSign } from "react-icons/ci";
import { BsArrowClockwise, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { Notify } from 'notiflix';

const AppointmentDetails = () => {
  const { id } = useParams(); 
  const [appointment, setAppointment] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole()
  const [open, setOpen] = useState(false)
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

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



  const handleOpenCancelDialog = () => {
    setOpenCancelDialog(true);
  };

  const handleCloseCancelDialog = () => {
    setOpenCancelDialog(false);
  };

  const handleConfirmCancel = async () => {
    try {
      const response = await api.post(`/api/appointment/${id}/cancel`);
      if (response.status === 200) {
        Notify.success("Appointment canceled successfully");
        fetchAppointment(); // Refresh UI
      }
    } catch (error) {
      console.error("Error canceling appointment:", error);
      Notify.failure("Failed to cancel appointment");
    } finally {
      setOpenCancelDialog(false); // Close dialog
    }
  };

  const handleUpdate = () => {
    setOpen(true)
  };


  if (isLoading && !appointment) return <LoadingScreen />;

  const formatTime = (timestring) => {
    if (!timestring) return "N/A"; 
    const [hours, minutes] = timestring.split(':');
    const date = new Date();
    date.setHours(hours, minutes, 0);
    return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  };

  const patientSymptoms = appointment?.patientSymptom?.symptoms 
  const symptomId = appointment?.patientSymptom?.id

  const handleRestoreAppointment = async () => {
    if (!appointment) return;

    const now = new Date();
    const appointmentEndTime = new Date(`${appointment.date}T${appointment.endTime}`);

    if (appointmentEndTime < now) {
      Notify.failure("Cannot restore appointment. The time has already passed.");
      return;
    }

    try {
      const response = await api.post(`/api/appointment/${appointment.id}/status`, {
        status: 'pending'
      },{
        _role: role
      })

      if (response.status === 200) {
        Notify.success("Appointment restored successfully");
        fetchAppointment(); // Refresh appointment details
      }
    } catch (error) {
      console.error("Error restoring appointment:", error);
      Notify.failure("Failed to restore appointment.");
    }
  };

  return (
    <PatientLayout>
      <div className="max-w-[90%]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-medium text-blue-700">Appointment Details</h1>
          <div className="flex gap-3">
            {
              appointment?.status !== 'cancelled' && (
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  <BsPencilSquare /> Update
                </button>
              )
            }

            <button
              onClick={handleOpenCancelDialog}
              disabled={appointment?.status === "cancelled"}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${appointment?.status === "cancelled"
                  ? "bg-red-400 text-gray-200 cursor-not-allowed" // Disabled styling
                  : "bg-red-500 text-white hover:bg-red-600" // Normal styling
                }`}
            >
              <BsTrash /> Cancel
            </button>
            {appointment?.status === "cancelled" && (
              <button
                onClick={handleRestoreAppointment}
                disabled={new Date(`${appointment.date}T${appointment.startTime}`) < new Date()} // Disable if time passed
                className={`flex items-center gap-2 px-4 py-2 rounded-md ${new Date(`${appointment.date}T${appointment.startTime}`) < new Date() ? "bg-gray-400 text-gray-700 cursor-not-allowed" : "bg-brand-600 text-white hover:bg-green-600"}`}
              >
                <BsArrowClockwise /> Restore Appointment
              </button>
            )}

            <Dialog open={openCancelDialog} onClose={handleCloseCancelDialog}>
              <DialogTitle className='text-[#ec942c]'><Warning/> Appointment Cancellation</DialogTitle>
              <DialogContent>
                <Typography>Are you sure you want to cancel this appointment?</Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseCancelDialog} color="primary">No</Button>
                <Button onClick={handleConfirmCancel}  color="error" variant="contained">Yes, Cancel</Button>
              </DialogActions>
            </Dialog>

          </div>

        </div>
        {
          appointment?.status === 'cancelled' && (
            <div className=" mb-11 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md">
              <p className="font-semibold">Note:</p>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>You can only restore an appointment if the appointment time has not passed.</li>
                <li>If your time slot has already been booked by someone else, you will need to schedule a new appointment</li>
              </ul>
            </div>
          )
        }

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
        appointment={appointment}
      />
    </PatientLayout>
  );
};
const InfoItem = ({ title, content, status }) => {
  let statusColor = "text-gray-600";
  if (status === "pending") statusColor = "text-yellow-600";
  if (status === "confirmed") statusColor = "text-brand-600";
  if (status === "cancelled") statusColor = "text-red-300";

  return (
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`mt-2 text-lg font-medium ${status ? statusColor : "text-gray-800"}`}>{content}</p>
    </div>
  );
};
export default AppointmentDetails;
