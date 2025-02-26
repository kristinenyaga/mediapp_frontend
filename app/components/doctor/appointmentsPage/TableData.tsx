import React, { useMemo, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BsDownload } from "react-icons/bs";
import { isWithinInterval, parseISO } from "date-fns";


const TableData = ({ data,columns,filters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter()

  const filteredAppointments = useMemo(() => {
    return data.filter((appointment) => {

      const { search, sex, startDate, endDate, status } = filters
      
      const appointmentDate = parseISO(appointment.date)
      const filterStartDate = startDate ? parseISO(startDate) : null
      const filterEndDate = startDate ? parseISO(endDate) : null

      const searchMatch =
        search.trim() === "" ||
        appointment.patient.name.toLowerCase().includes(search.toLowerCase())
      
      const statusMatch = status === '' || appointment.status === status
      const sexMatch = sex === '' || appointment.patient.gender.toLowerCase() === sex.toLowerCase()

      const dateMatch = 
        (!filterStartDate || !filterEndDate) ||
        isWithinInterval(appointmentDate, {
          start: filterStartDate,
          end: filterEndDate
          
        })
      
      return statusMatch && dateMatch && searchMatch && sexMatch
    })
  }, [filters, data])
  
  console.log(filters)

  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = filteredAppointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <TableContainer component={Paper} sx={{
      mt: 4,
      border: "1px solid #E0E0E0",
      boxShadow: "none",
      borderRadius: "8px",
      overflowX: "auto"
    }}>
      <button className="flex gap-2 items-center p-3 pl-3 bg-[#6c4de60a] rounded-md m-3 text-blue-700">download <BsDownload className=" font-medium text-lg text-blue-700" /></button>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col,index) => (
              <TableCell sx={{ fontWeight: 600, color: "#333", padding: "12px 16px"}} key={index} >{ col.label}</TableCell>
            ))}
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {displayedData.length > 0 ? (
            displayedData.map((row,index) => (
              <TableRow sx={{
                bgcolor: index % 2 !== 0 ? "#FFFFFF" : "#FAFAFA",
                "&:hover": { bgcolor: "#F1F1F1" }, color:'#4F5653'
              }} key={row.id}>
                {columns.map((col) => (
                  <TableCell sx={{ padding: "12px 16px", color: "#444", fontSize: "14px" }} key={col.key}>
                    {col.key === "patient" && typeof row.patient === "object" ? (
                      row.patient.username
                    ) : col.key === "sex" && typeof row.patient === "object" ? (
                      row.patient.gender
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

                  <TableCell sx={{ padding: "12px 16px" }}>
                  {/* <button className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300">Edit</button> */}
                  <button className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300"
                    onClick={() => router.push(userType === 'doctor' ? `/admin/users/doctors/${row.id}` : `/admin/users/patients/${row.id}`)}>View</button>
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