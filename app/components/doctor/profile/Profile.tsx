"use client";
import React, { useState } from "react";
import DoctorLayout from "../doctorLayout";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [fields, setFields] = useState([]);
  const [initialValues, setInitialValues] = useState({});

  const handleOpen = (section, fieldsData, initialValuesData) => {
    setCurrentSection(section);
    setFields(fieldsData);
    setInitialValues(initialValuesData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (updatedValues) => {
    console.log(`Updated ${currentSection}:`, updatedValues);
    // TODO: Send the updated data to the backend
  };

  return (
    <DoctorLayout>
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-[22px] font-semibold text-blue-600">Doctor Profile</h2>
            <p className="text-sm text-gray-500">Manage your profile information and preferences</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <section className="mb-8">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black">Personal Information</h3>
            <button
              className="text-gray-600 hover:text-blue-300 border border-gray-300 p-2 py-1 rounded-lg text-sm"
              onClick={() =>
                handleOpen(
                  "Personal Information",
                  [
                    { name: "fullName", label: "Full Name", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "phone", label: "Phone", required: true },
                  ],
                  { fullName: "Dr. Jane Doe", email: "janedoe@example.com", phone: "+254 712 345 678" }
                )
              }
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Full Name</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">Dr. Jane Doe</div>
            </div>
            <div>
              <label className="block text-gray-800">Email</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">janedoe@example.com</div>
            </div>
            <div>
              <label className="block text-gray-800">Phone</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">+254 712 345 678</div>
            </div>
          </div>
        </section>

        {/* Professional Information Section */}
        <section className="mb-8">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black">Professional Information</h3>
            <button
              className="text-gray-600 hover:text-blue-300 border border-gray-300 p-2 py-1 rounded-lg text-sm"
              onClick={() =>
                handleOpen(
                  "Professional Information",
                  [
                    { name: "specialization", label: "Specialization", required: true },
                    { name: "experience", label: "Years of Experience", type: "number", required: true },
                    { name: "hospital", label: "Hospital Affiliation" },
                  ],
                  { specialization: "Cardiologist", experience: "10", hospital: "MediCare Hospital" }
                )
              }
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Specialization</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">Cardiologist</div>
            </div>
            <div>
              <label className="block text-gray-800">Years of Experience</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">10</div>
            </div>
            <div>
              <label className="block text-gray-800">Hospital Affiliation</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">MediCare Hospital</div>
            </div>
          </div>
        </section>

        {/* Availability Section */}
        <section className="mb-8">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black">Availability</h3>
            <button
              className="text-gray-600 hover:text-blue-300 border border-gray-300 p-2 py-1 rounded-lg text-sm"
              onClick={() =>
                handleOpen(
                  "Availability",
                  [
                    { name: "weekdays", label: "Weekdays" },
                    { name: "weekends", label: "Weekends" },
                  ],
                  { weekdays: "9:00 AM - 4:00 PM", weekends: "10:00 AM - 2:00 PM" }
                )
              }
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Weekdays</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">9:00 AM - 4:00 PM</div>
            </div>
            <div>
              <label className="block text-gray-800">Weekends</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">10:00 AM - 2:00 PM</div>
            </div>
          </div>
        </section>

        {/* Notifications & Preferences */}
        <section>
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black">Notifications & Preferences</h3>
            <button
              className="text-gray-600 hover:text-blue-300 border border-gray-300 p-2 py-1 rounded-lg text-sm"
              onClick={() =>
                handleOpen(
                  "Notifications & Preferences",
                  [
                    { name: "emailNotifications", label: "Email Notifications", type: "select", options: [{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }] },
                    { name: "smsNotifications", label: "SMS Notifications", type: "select", options: [{ value: "enabled", label: "Enabled" }, { value: "disabled", label: "Disabled" }] },
                  ],
                  { emailNotifications: "enabled", smsNotifications: "disabled" }
                )
              }
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Email Notifications</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">Enabled</div>
            </div>
            <div>
              <label className="block text-gray-800">SMS Notifications</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">Disabled</div>
            </div>
          </div>
        </section>

        {/* <UpdateModal
          open={open}
          handleClose={handleClose}
          section={currentSection}
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        /> */}
      </div>
    </DoctorLayout>
  );
};

export default Profile;
