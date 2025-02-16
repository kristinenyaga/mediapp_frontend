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
} from "@mui/material";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useRouter } from "next/navigation";
import { BsDownload } from "react-icons/bs";
import { handleDownloadPDF } from "./handledownload";

const TableData = ({ filters,data,columns }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter()

  // filtering logic
  const filteredData = useMemo(() => {
    return data.filter((appointment) => {
      const { dateFrom, dateTo, status, username } = filters
      
      if (status !== 'all' && appointment.status !== status) {
        return false
      }
      if (dateFrom && new Date(appointment.date) < new Date(dateFrom)) {
        return false
      }
      if (dateTo && new Date(appointment.date) > new Date(dateTo)) {
        return false
      }
      if (username) {
        const patientName = appointment.patient?.username || ''
        const doctorName = appointment.doctor?.username || ''

        const searchText = username.toLowerCase()
        if (!patientName.toLowerCase().includes(searchText) && !doctorName.toLowerCase().includes(searchText)) {
          return false
        }
      }
      return true
    })
  }, [data, filters])
  
  // Pagination logic
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <TableContainer component={Paper} sx={{
      mt: 4,
      border: "1px solid #E0E0E0",
      boxShadow: "none",
      borderRadius: "8px",
      overflowX: "auto"
    }}>
      <button className="flex gap-2 items-center p-3 pl-3 bg-[#6c4de60a] rounded-md m-3 text-secondary" onClick={()=>handleDownloadPDF(filteredData,filters)}>download <BsDownload className="font-medium text-lg text-secondary" /></button>
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
                    ):
                      (
                        Array.isArray(row[col.key]) ? row[col.key].length : row[col.key]
                    )}
                  </TableCell>
                ))}

                <TableCell sx={{ padding: "12px 16px" }}>
                  {/* <button className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300">Edit</button> */}
                  <button className="px-3 py-1 mx-1 border rounded-md bg-gray-200 hover:bg-gray-300"
                    onClick={() => router.push(`/admin/appointments/${row.id}`)}>View</button>
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