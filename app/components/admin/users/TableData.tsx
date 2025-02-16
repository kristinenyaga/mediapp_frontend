import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Switch,
  Button,
} from "@mui/material";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BsDownload } from "react-icons/bs";
import { handleDownloadPDF } from './handledownload'


const TableData = ({ search, filters,data,columns,userType,name }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter()

  const toggleStatus = (id) => {
    setDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.id === id
          ? { ...doctor, status: doctor.status === "Active" ? "Inactive" : "Active" }
          : doctor
      )
    );
  };

  const filteredData = data.filter((row) => {
    // if (filters.status && row.status !== filters.status) return false;

    if (userType === "doctor") {
      if (filters.specialization && row.specialization !== filters.specialization) return false;
      if (filters.experience && row.yearsOfExperience < filters.experience) return false;
      if (filters.roomNumber && row.room_number !== Number(filters.room_number)) return false;
    }
    else if (userType === "appointment") {
      if (filters.dateFrom && new Date(row.date) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(row.date) > new Date(filters.dateTo)) return false;
      if (filters.status && row.status !== filters.status) return false;


      if (filters.patientName && row.patient?.username) {
        if (!row.patient.username.toLowerCase().includes(filters.patientName.toLowerCase())) {
          return false;
        }
      }

      return true; 
    }
    // if (userType === "patient") {
    //   if (filters.gender && row.gender !== filters.gender) return false;
    //   if (filters.ageRange && (row.age < filters.ageRange[0] || row.age > filters.ageRange[1])) return false;
    //   if (filters.lastVisit && row.lastVisit !== filters.lastVisit) return false;
    // }

    return true;
  });

  const searchedData = filteredData.filter((row) => {
    if (userType === "doctor" || userType === "patient") {
      return (
        row.username?.toLowerCase().includes(search.toLowerCase()) ||
        row.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return true; // Default case
  });

  // Pagination logic
  const itemsPerPage = 3;
  const totalPages = Math.ceil(searchedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = searchedData.slice(startIndex, startIndex + itemsPerPage);
  console.log(columns)

  console.log('displayed data',searchedData)


  return (
    <TableContainer component={Paper} sx={{
      mt: 4,
      border: "1px solid #E0E0E0",
      boxShadow: "none",
      borderRadius: "8px",
      overflowX: "auto"
    }}>
      <button className="flex gap-2 items-center p-3 pl-3 bg-[#6c4de60a] rounded-md m-3 text-secondary" onClick={() => handleDownloadPDF(searchedData, filters, userType, name)} >download <BsDownload className=" font-medium text-lg text-secondary" /></button>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col,index) => (
              <TableCell sx={{ fontWeight: 600, color: "#333", padding: "12px 16px"}} key={index} >{ col.label}</TableCell>
            ))}
            {
              (userType === 'patient' || userType === 'doctor') && (
                <TableCell>Actions</TableCell>)
            }
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedData.length > 0 ? (
            displayedData.map((row,index) => (
              <TableRow sx={{
                bgcolor: index % 2 === 0 ? "#FFFFFF" : "#FAFAFA",
                "&:hover": { bgcolor: "#F1F1F1" }
              }} key={row.id}>
                {columns.map((col) => (
                  <TableCell sx={{ padding: "12px 16px", color: "#444", fontSize: "14px" }} key={col.key}>
                    {col.key === "status" && (userType === 'patient' || userType === 'doctor') ? (
                      <>
                        <Switch
                          checked={row[col.key] === "Active"}
                          onChange={() => toggleStatus(row.id)}
                          color="primary"
                        />
                        {row[col.key]}
                      </>
                    ) : col.key === "patient" && typeof row.patient === "object" ? (
                      row.patient.username || row.patient.name
                    ) :
                      (
                        Array.isArray(row[col.key]) ? row[col.key].length : row[col.key]
                    )}
                  </TableCell>
                ))}
                {
                  (userType === 'patient' || userType === 'doctor') && (
                    <TableCell sx={{ padding: "12px 16px" }}>
                  {/* <button className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300">Edit</button> */}
                  <button className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300"
                    onClick={() => router.push(userType === 'doctor' ? `/admin/users/doctors/${row.id}` : `/admin/users/patients/${row.id}`)}>View</button>
                </TableCell>)
                }

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
