"use client";
import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import { Notify } from "notiflix";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,Paper } from "@mui/material";
import { BsFillInfoCircleFill, BsInfoCircle, BsTrash, BsUpload } from "react-icons/bs";
import Papa from "papaparse";
import { FaUpload } from "react-icons/fa";
import { RiUpload2Fill } from "react-icons/ri";
import { MdFileCopy } from "react-icons/md";
const AddDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({ username: "", email: "", phone: "", specialization: "", experience: "", roomNumber: "" });
  const [csvFile, setCsvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setNewDoctor({ ...newDoctor, [field]: value });
  };

  const addDoctor = () => {
    if (Object.values(newDoctor).some(value => value === "")) {
      Notify.failure("Please fill in all fields.");
      return;
    }
    setDoctors([...doctors, newDoctor]);
    setNewDoctor({ username: "", email: "", phone: "", specialization: "", experience: "", roomNumber: "" });
  };

  const removeDoctor = (index) => {
    const updatedDoctors = doctors.filter((_, i) => i !== index);
    setDoctors(updatedDoctors);
    Notify.success("Doctor removed successfully!");
  };

  const handleFileUpload = (e) => {
    setCsvFile(e.target.files[0]);
  };
  const handleRemoveFileUpload = () => {
    resetFileInput()
    setDoctors([])
  }

  const handleSubmit = async () => {
    console.log(doctors)

    setIsLoading(true);
    try {
      
      const response = await axios.post("http://localhost:5000/api/admin/addDoctors", {doctors}, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        Notify.success("Doctors added successfully!");
        setDoctors([]);
        setCsvFile(null);
      }
    } catch (error) {
      Notify.failure("Failed to add doctors. Please try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clears the file input
    }
    setCsvFile(null);
  };
  useEffect(() => {
    const expectedHeaders = ["name", "email", "phone", "specialization", "experience", "room"];

    if (csvFile) {
      Papa.parse(csvFile, {
        complete: (result) => {
          const headers = result.meta.fields || [];
          const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));

          if (missingHeaders.length > 0) {
            Notify.failure(`CSV is missing required columns: ${missingHeaders.join(", ")}`);
            resetFileInput()
            return;
          }

          const parsedDoctors = result.data.map((row) => ({
            username: row.username || row.name,
            email: row.email,
            phone: row.phone,
            specialization: row.specialization || row.field,
            experience: row.experience || row.yearsOfExperience,
            roomNumber: row.roomNumber || row.room,
          }));

          if (parsedDoctors.some((doc) => Object.values(doc).some((val) => !val))) {
            Notify.failure("CSV contains empty fields. Please check your file.");
            return;
          }

          setDoctors((prev) => [...prev, ...parsedDoctors]);
          Notify.success("CSV uploaded successfully!");
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }, [csvFile]);

  console.log(csvFile)

  return (
    <AdminLayout>
      <div className="w-[90%]">
        <h2 className="text-2xl mb-5 font-medium text-gray-800">Add Doctors</h2>

        <div className="mt-4">
          <p className="text-sm text-gray-600  mb-4 flex items-center gap-2">
            <BsFillInfoCircleFill /> <span>Ensure your CSV file has columns:</span>
            name, email, phone, specialization, experience, room
          </p>

          <label className="block font-medium text-blue-600 mb-4">Upload CSV File</label>

          {/* Custom File Upload */}
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-gray-600 text-sm flex justify-center items-center gap-2">Click to upload <RiUpload2Fill className=" text-xl mb-1" /></p>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {/* Display Selected File Name */}
          {csvFile && (
            <p className="mt-3 text-sm text-gray-800 flex items-center">{csvFile.name}</p>
          )}

          <button
            onClick={() => handleRemoveFileUpload()}
            className="mt-5 flex items-center gap-2 text-sm text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
          >
            <BsTrash className="text-red-500" /> Remove file
          </button>
        </div>


        <div className="text-center my-6 text-blue-600 text-lg">OR</div>

        {/* Manual Doctor Entry */}
        <div className="grid grid-cols-3 gap-4 rounded-lg">
          <input type="text" placeholder="Name" value={newDoctor.username} onChange={(e) => handleChange("username", e.target.value)} className="border p-2 rounded-md text-sm border-gray-300 placeholder:text-gray-600 placeholder:text-sm py-3" />
          <input type="email" placeholder="Email" value={newDoctor.email} onChange={(e) => handleChange("email", e.target.value)} className="border p-2 rounded-md text-sm border-gray-300 placeholder:text-gray-600 placeholder:text-sm py-3" />
          <input type="text" placeholder="Phone" value={newDoctor.phone} onChange={(e) => handleChange("phone", e.target.value)} className="border p-2 rounded-md text-sm border-gray-300 placeholder:text-gray-600 placeholder:text-sm py-3" />
          <input type="text" placeholder="Specialization" value={newDoctor.specialization} onChange={(e) => handleChange("specialization", e.target.value)} className="border p-2 rounded-md text-sm border-gray-300 placeholder:text-gray-600 placeholder:text-sm py-3" />
          <input type="number" placeholder="Experience (Years)" value={newDoctor.experience} onChange={(e) => handleChange("experience", e.target.value)} className="border p-2 rounded-md text-sm border-gray-300 placeholder:text-gray-600 placeholder:text-sm py-3" />
          <input type="text" placeholder="Room Number" value={newDoctor.roomNumber} onChange={(e) => handleChange("roomNumber", e.target.value)} className="border p-2 rounded-md text-sm border-gray-300 placeholder:text-gray-600 placeholder:text-sm py-3" />
        </div>

        <button onClick={addDoctor} className="mt-4 text-sm text-blue-600 hover:underline">+ Add Doctor</button>

        {/* Doctors Table */}
        {doctors.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <TableContainer component={Paper} sx={{
              mt: 4,
              border: "1px solid #E0E0E0",
              boxShadow: "none",
              borderRadius: "8px",
              overflowX: "auto",
              maxHeight: "260px", 
              overflowY: "auto",   
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Specialization</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Room Number</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    doctors.map((doctor, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{color:'#4F5653'}}>{doctor.username}</TableCell>
                        <TableCell sx={{color:'#4F5653'}}>{doctor.email}</TableCell>
                        <TableCell sx={{color:'#4F5653'}}>{doctor.phone}</TableCell>
                        <TableCell sx={{color:'#4F5653'}}>{doctor.specialization}</TableCell>
                        <TableCell sx={{color:'#4F5653'}}>{doctor.experience}</TableCell>
                        <TableCell sx={{color:'#4F5653'}}>{doctor.roomNumber}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => removeDoctor(index)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Remove
                          </button>
                        </TableCell>

                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex mt-6">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-blue-600 text-white px-10 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Submit"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddDoctors;
