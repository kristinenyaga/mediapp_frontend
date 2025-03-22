import React, { useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BsDownload, BsThreeDotsVertical } from "react-icons/bs";
import { handleDownloadPDF } from "./handledownload";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import api from "@/app/utils/axiosInstance";
import AvailableDoctors from "./AvailableDoctors";
import { Notify } from "notiflix";
import { isWithinInterval, parseISO } from "date-fns";
const TableData = ({ filters, appointments, setAppointments,columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(false);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [appointmentToReassign, setAppointmentToReassign] = useState(false)
  const [availableDoctors, setAvailableDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState({})
  const [openReassignModal, setOpenReassignModal] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const handleView = (id) => {
    router.push(`/admin/appointments/${id}`);
  };

  const handleReassign = async (appointment) => {
    setAppointmentToReassign(appointment)
    try {
      if (appointmentToReassign) {
        const response = await api.post('/api/appointment/get-available-doctors', {
          startTime: appointmentToReassign.startTime,
          endTime: appointmentToReassign.endTime,
          date: appointmentToReassign.date,
        })
        setAvailableDoctors(response.data)
      }
      setOpenReassignModal(true)
    } catch (error) {
      console.log(error)
    }
  };
  const handleConfirmCancel = (id) => {
    // handleCancel(id);
    setOpen(true)
  };
  const handleCancel = async (id) => {
    setOpen(false)
    try {
      console.log('cancel', id)
      const response = await api.post(`/api/appointment/${id}/cancel`, {
        doctorId: selectedDoctor
      })
      setAppointments((prevAppointments) => prevAppointments.map((appointment) => appointment.id === id ? { ...appointment, status: response.data?.status } : appointment

      ))
      setOpenMenu(false)
      Notify.success("Appointment cancelled ")
    } catch (error) {
      console.error("Error canceling appointment:", error);
      Notify.failure("Failed to cancel appointment.");
    }
  };

  const uploadReassign = async () => {
    setOpenReassignModal(false)
    setOpenMenu(false)

    try {
      const response = await api.post(`/api/appointment/${appointmentToReassign.id}/reassign`, {
        doctorId: selectedDoctor
      })
      setAppointments((prevAppointments) => prevAppointments.map((appointment) => appointment.id === appointmentToReassign.id ? { ...appointment, doctor: response.data?.doctor.username } : appointment
        
      ))
      Notify.success(`Appointment reassigned to ${response.data?.doctor.username}`)
    } catch (error) {
      console.log(error)
    }
  }

  // filtering logic
  const filteredData = useMemo(() => {
    return appointments.filter((appointment) => {
      const { startDate, endDate, status, username } = filters;

      const appointmentDate = parseISO(appointment.date);
      const filterStartDate = startDate ? parseISO(startDate) : new Date();
      const filterEndDate = endDate ? parseISO(endDate) : new Date();

      // Status Filtering
      const statusMatch = status === 'all' || appointment.status === status;

      // Date Filtering
      const dateMatch = isWithinInterval(appointmentDate, {
        start: filterStartDate,
        end: filterEndDate,
      });

      // Search Filtering (by patient or doctor name)
      const searchMatch =
        !username ||
        appointment.patient?.username.toLowerCase().includes(username.toLowerCase()) ||
        appointment.doctor?.username.toLowerCase().includes(username.toLowerCase());

      return statusMatch && dateMatch && searchMatch;
    });
  }, [appointments, filters]);


  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  console.log(displayedData)
  return (
    <TableContainer component={Paper} sx={{
      mt: 4,
      border: "1px solid #E0E0E0",
      boxShadow: "none",
      borderRadius: "8px",
      overflowX: "auto"
    }}>
      <button className="flex gap-2 items-center p-3 pl-3 bg-[#6c4de60a] rounded-md m-3 text-secondary" onClick={() => handleDownloadPDF(filteredData, filters)}>download <BsDownload className="font-medium text-lg text-secondary" /></button>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col, index) => (
              <TableCell sx={{ fontWeight: 600, color: "#333", padding: "12px 16px" }} key={index} >{col.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedData.length > 0 ? (
            displayedData.map((row, index) => (
              <TableRow sx={{
                bgcolor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                "&:hover": { bgcolor: "#F1F1F1" }
              }} key={row.id}>
                {columns.map((col) => (
                  <TableCell sx={{ padding: "12px 16px", color: "#444", fontSize: "14px" }} key={col.key}>
                    {col.key === "patient" && typeof row.patient === "object" ? (
                      row.patient.username || row.patient.name
                    ) : col.key === "doctor" && typeof row.doctor === "object" ? (
                      row.doctor.username || row.patient.name
                    ) : col.key === "date" ? (
                      new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(row.date))
                    ) : col.key === 'startTime' ? (`${row.startTime} - ${row.endTime}`) :
                      (
                        Array.isArray(row[col.key]) ? row[col.key].length : row[col.key]
                      )}
                  </TableCell>
                ))}

                <TableCell sx={{ padding: "12px 16px", position: 'relative' }}>
                  <button
                    className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    onClick={() => handleOpenMenu(row.id)}
                  >
                    <BsThreeDotsVertical />
                  </button>
                  {openMenu === row.id && (
                    <div className="absolute flex flex-col gap-2 -left-2 mt-2 w-40 bg-white border rounded-lg shadow-lg z-10">
                      {/* <button
                        className="block border-b w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleView(row.id)}
                      >
                        View
                      </button> */}
                      <button
                        className="block border-b w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleReassign(row)}
                      >
                        Reassign
                      </button>
                      <AvailableDoctors uploadReassign={uploadReassign} setOpenMenu={setOpenMenu} openReassignModal={openReassignModal} setOpenReassignModal={setOpenReassignModal} availableDoctors={availableDoctors} selectedDoctor={selectedDoctor} setSelectedDoctor={setSelectedDoctor} />
                      <button
                        className="block border-b w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        onClick={() => {
                          handleConfirmCancel(row.id)
                        }}
                      >
                        Cancel
                      </button>
                      {
                        open && (
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle sx={{ color: '#FF8503' }} id="alert-dialog-title">
                              {"Warning!"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Are you sure you want to cancel this appointment?
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => handleCancel(row.id)}>Yes</Button>
                              <Button onClick={() => {
                                setOpen(false)
                                setOpenMenu(false)
                              }} autoFocus>
                                No
                              </Button>
                            </DialogActions>
                          </Dialog>
                        )
                      }
                    </div>
                  )}
                </TableCell>
              </TableRow>

            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No Results Available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="my-6 mt-10">
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300"
          >
            <MdKeyboardDoubleArrowLeft />
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-1 mx-1 border rounded-md ${currentPage === index + 1 ? "bg-[#6c4de612] font-medium text-secondary" : "bg-gray-200 hover:bg-gray-300 font-medium text-secondary"
                }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300"
          >
            <MdKeyboardDoubleArrowRight />
          </button>
        </div>
      </div>
    </TableContainer>
  );
};

export default TableData;