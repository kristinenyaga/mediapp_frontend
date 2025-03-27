"use client";
import React, { useEffect, useRef, useState } from "react";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import { Notify } from "notiflix";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { BsFillInfoCircleFill, BsTrash } from "react-icons/bs";
import Papa from "papaparse";
import { RiUpload2Fill } from "react-icons/ri";
import GoBack from "../../goBack/GoBack";
const AddDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [newDoctor, setNewDoctor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    roomNumber: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [editIndex, setEditIndex] = useState(null);
  const handleInputChange = (index, field, value) => {
    const updatedDoctors = [...doctors];
    updatedDoctors[index][field] = value;
    setDoctors(updatedDoctors);
  };

  const handleEdit = (index) => {
    setEditIndex(index);
  };

  const handleSave = () => {
    setEditIndex(null);
    Notify.success("Changes saved successfully!");
  };

  const handleChange = (field, value) => {
    setNewDoctor({ ...newDoctor, [field]: value });
  };

  const addDoctor = () => {
    if (Object.values(newDoctor).some((value) => value === "")) {
      Notify.failure("Please fill in all fields.");
      return;
    }
    setDoctors([...doctors, newDoctor]);
    setNewDoctor({
      firstName: "",
      lastName:"",
      email: "",
      phone: "",
      specialization: "",
      experience: "",
      roomNumber: "",
    });
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
    resetFileInput();
    setDoctors([]);
  };

  const handleSubmit = async () => {
    if (doctors.length === 0) {
      Notify.failure("You have not uploaded any file");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/addDoctors",
        { doctors },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 201) {
        Notify.success("Doctors added successfully!");
        setDoctors([]);
        setCsvFile(null);
      }
  } catch (error) {
    console.error("Error adding doctors:", error);

    if (error.response) {
      // Handle specific backend error messages
      Notify.failure(error.response.data.message || "Failed to add doctors.");
    } else {
      // Handle network or unexpected errors
      Notify.failure("A network error occurred. Please try again.");
    }
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
    const expectedHeaders = [
      "firstname",
      "lastname",
      "email",
      "phone",
      "specialization",
      "experience",
      "room",
    ];

    if (csvFile) {
      Papa.parse(csvFile, {
        complete: (result) => {
          const headers = result.meta.fields || [];
          const missingHeaders = expectedHeaders.filter(
            (header) => !headers.includes(header)
          );

          if (missingHeaders.length > 0) {
            Notify.failure(
              `CSV is missing required columns: ${missingHeaders.join(", ")}`
            );
            resetFileInput();
            return;
          }

          const parsedDoctors = result.data.map((row) => ({
            firstName: row.firstname,
            lastName:row.lastname,
            email: row.email,
            phone: row.phone,
            specialization: row.specialization || row.field,
            experience: row.experience || row.yearsOfExperience,
            roomNumber: row.roomNumber || row.room,
          }));

          if (
            parsedDoctors.some((doc) => Object.values(doc).some((val) => !val))
          ) {
            Notify.failure(
              "CSV contains empty fields. Please check your file."
            );
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

  return (
    <AdminLayout>
      <div className="w-[90%]">
        <GoBack />
        <h2 className="text-2xl mb-5 font-medium text-blue-700">Add Doctors</h2>

        <div className="mt-4">
          <p className="text-sm bg-yellow-50 py-4 text-gray-800  mb-4 flex items-center gap-2">
            <BsFillInfoCircleFill />{" "}
            <span>Ensure your CSV file has columns:</span>
            firstname,lastname, email, phone, specialization, experience, room
          </p>

          <label className="block font-medium text-blue-600 mb-4">
            Upload CSV File
          </label>

          {/* Custom File Upload */}
          <div
            className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <p className="text-gray-800 text-base flex justify-center items-center gap-2">
              Click to upload <RiUpload2Fill className=" text-xl mb-1" />
            </p>
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
            <p className="mt-3 text-sm text-gray-800 flex items-center">
              {csvFile.name}
            </p>
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
        <div className="grid grid-cols-4 gap-4 rounded-lg">
          <input
            type="text"
            placeholder="First Name"
            value={newDoctor.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={newDoctor.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={newDoctor.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
          <input
            type="text"
            placeholder="Phone"
            value={newDoctor.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
          <input
            type="text"
            placeholder="Specialization"
            value={newDoctor.specialization}
            onChange={(e) => handleChange("specialization", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
          <input
            type="number"
            placeholder="Experience (Years)"
            value={newDoctor.experience}
            onChange={(e) => handleChange("experience", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
          <input
            type="text"
            placeholder="Room Number"
            value={newDoctor.roomNumber}
            onChange={(e) => handleChange("roomNumber", e.target.value)}
            className="border p-2 rounded-md text-base border-gray-300 placeholder:text-gray-700 placeholder:text-base py-3"
          />
        </div>

        <button
          onClick={addDoctor}
          className="mt-4 text-lg text-blue-600 hover:underline"
        >
          + Add Doctor
        </button>

        {/* Doctors Table */}
        {doctors.length > 0 && (
          <div className="mt-6 overflow-x-auto">
            <TableContainer
              component={Paper}
              sx={{
                mt: 4,
                border: "1px solid #E0E0E0",
                boxShadow: "none",
                borderRadius: "8px",
                overflowX: "auto",
                maxHeight: "260px",
                overflowY: "auto",
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>First Name</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Last Name</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Email</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Phone</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Specialization</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Experience</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Room Number</TableCell>
                    <TableCell sx={{fontSize:'17px',color:'#000'}}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {doctors.map((doctor, index) => (
<TableRow key={index}>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={doctor.firstName}
                            onChange={(e) => handleInputChange(index, "firstName", e.target.value)}
                            className="border p-1 rounded text-base "
                          />
                        ) : (
                          doctor.firstName
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={doctor.lastName}
                            onChange={(e) => handleInputChange(index, "lastName", e.target.value)}
                            className="border p-1 rounded text-base "
                          />
                        ) : (
                          doctor.lastName
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="email"
                            value={doctor.email}
                            onChange={(e) => handleInputChange(index, "email", e.target.value)}
                            className="border p-1 rounded text-base"
                          />
                        ) : (
                          doctor.email
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={doctor.phone}
                            onChange={(e) => handleInputChange(index, "phone", e.target.value)}
                            className="border p-1 rounded text-base"
                          />
                        ) : (
                          doctor.phone
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={doctor.specialization}
                            onChange={(e) => handleInputChange(index, "specialization", e.target.value)}
                            className="border p-1 rounded text-base"
                          />
                        ) : (
                          doctor.specialization
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="number"
                            value={doctor.experience}
                            onChange={(e) => handleInputChange(index, "experience", e.target.value)}
                            className="border p-1 rounded text-base"
                          />
                        ) : (
                          doctor.experience
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={doctor.roomNumber}
                            onChange={(e) => handleInputChange(index, "roomNumber", e.target.value)}
                            className="border p-1 rounded text-base"
                          />
                        ) : (
                          doctor.roomNumber
                        )}
                      </TableCell>
                      <TableCell>
                        {editIndex === index ? (
                          <button
                            onClick={() => handleSave(index)}
                            className="text-brand-600 ml-4 hover:underline text-base"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(index)}
                            className="text-blue-600 hover:underline text-base ml-4"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => removeDoctor(index)}
                          className="text-red-600 hover:underline text-base ml-4"
                        >
                          Remove
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
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
            className="bg-blue-700 text-lg text-white px-16 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Adding..." : "Submit"}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddDoctors;
