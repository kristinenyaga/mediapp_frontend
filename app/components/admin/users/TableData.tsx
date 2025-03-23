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

      // Convert both to numbers before comparison
      if (filters.yearsOfExperience && Number(row.yearsOfExperience) < Number(filters.yearsOfExperience)) return false;

      if (filters.room_number && Number(row.room_number) !== Number(filters.room_number)) return false;
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
    if (userType === "patient") {
      if (filters.gender && row.gender.toLowerCase() !== filters.gender.toLowerCase()) return false;
      if (filters.ageRange && (row.age < filters.ageRange[0] || row.age > filters.ageRange[1])) return false;
      if (filters.lastVisit && row.lastVisit !== filters.lastVisit) return false;
    }

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

  return (
    <TableContainer component={Paper} sx={{
      mt: 4,
      border: "1px solid #DFE1E0",
      boxShadow: "none",
      borderRadius: "8px",
      overflowX: "auto"
    }}>
      <button className="flex gap-2 items-center p-3 pl-3 bg-blue-50 rounded-md m-3 text-blue-600" onClick={() => handleDownloadPDF(searchedData, filters, userType, name)} >download <BsDownload className=" font-medium text-lg text-blue-600" /></button>
      <Table>
        <TableHead sx={{ bgcolor: "#F8F9FA" }}>
          <TableRow>
            {columns.map((col,index) => (
              <TableCell sx={{
                fontWeight: "medium",
                color: "#000",
                padding: "14px 18px",
                fontSize: "16px",
                borderBottom: "2px solid #E0E0E0",
              }} key={index} >{col.label}</TableCell>
            ))}
            {
              (userType === 'patient' || userType === 'doctor') && (
                <TableCell sx={{ fontWeight: 500, color: "#000", padding: "12px 16px", fontSize: '18px' }}>Actions</TableCell>)
            }
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedData.length > 0 ? (
            displayedData.map((row,index) => (
              <TableRow sx={{
                padding: "14px 18px",
                color: "#495057",
                fontSize: "15px",
                borderBottom: "1px solid #E0E0E0",
              }} key={row.id}>
                {columns.map((col) => (
                  <TableCell sx={{ padding: "12px 16px", color: "#363D3A", fontSize: "16px" }} key={col.key}>
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
                      ) : col.key === "date" ? (
                        new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(row.date))
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
                  <button className="px-3 py-1 mx-1 border border-blue-600 text-blue-600 rounded-md "
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
