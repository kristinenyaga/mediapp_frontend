"use client";
import React, { useState } from "react";
import PatientLayout from "../patientLayout";
import { Box, Modal, Typography } from "@mui/material";
import UpdateModal from "./UpdateModal";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};
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
    <PatientLayout>
      <div className="">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-[22px] font-semibold text-blue-600">Profile Information</h2>
            <p className="text-sm text-gray-500">View and update your profile information</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <section className="mb-4 mt-10">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black mb-5">Personal Information</h3>
            <button className="mb-5 text-gray-600 hover:text-blue-300 hover:border-blue-200 cursor-pointer text-sm border border-gray-300 p-2 py-1 rounded-lg" onClick={() =>
              handleOpen(
                "Personal Information",
                [
                  { name: "fullName", label: "Full Name", required: true },
                  { name: "email", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone", required: true },
                  { name: "address", label: "Address" },
                ],
                {
                  fullName: "Kristine Johnson",
                  email: "kristine@example.com",
                  phone: "123-456-7890",
                  address: "123 Main St",
                }
              )
            }>update</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 bg-gray-300 rounded-full"></div>
            <div className="grid grid-cols-2 gap-4 text-sm w-full">
              <div>
                <label className="block text-gray-800">Full Name</label>
                <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">Kristine Johnson</div>
              </div>
              <div>
                <label className="block text-gray-800">Email</label>
                <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">kristine@example.com</div>
              </div>
              <div>
                <label className="block text-gray-800">Phone</label>
                <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">Nan</div>
              </div>
              <div>
                <label className="block text-gray-800">Address</label>
                <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">Nan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Health Information Section */}
        <section className="mb-4 mt-10">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black mb-5">Health Information</h3>
            <button className="mb-5 text-gray-600 hover:text-blue-300 hover:border-blue-200 cursor-pointer text-sm border border-gray-300 p-2 py-1 rounded-lg" onClick={() =>
              handleOpen(
                "Health Information",
                [
                  { name: "allergies", label: "Allergies" },
                  { name: "medications", label: "Ongoing Medications" },
                ],
                {
                  allergies: "None",
                  medications: "None",
                }
              )
            }>update</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Allergies</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">Nan</div>
            </div>
            <div>
              <label className="block text-gray-800">Ongoing Medications</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">Nan</div>
            </div>
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section className="mb-4 mt-10">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-red-300 mb-5">Emergency Contact</h3>
            <button className="mb-5 text-gray-600 hover:text-blue-300 hover:border-blue-200 cursor-pointer text-sm border border-gray-300 p-2 py-1 rounded-lg"
              onClick={() => handleOpen(
                'Emergency Contact',
                [
                  { name: "name", label: "Full Name", required: true },
                  { name: "relationship", label: "Email", type: "email", required: true },
                  { name: "phone", label: "Phone", required: true },
                  { name: "address", label: "Address" },
                ],
                {
                  name: 'nan',
                  relationship: 'nan',
                  phone: 'nan',
                  address:'nan'
                }
              )}
            >update</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Name</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">John Doe</div>
            </div>
            <div>
              <label className="block text-gray-800">Relationship</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">Spouse</div>
            </div>
            <div>
              <label className="block text-gray-800">Phone</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">+123 456 7891</div>
            </div>
            <div>
              <label className="block text-gray-800">Address</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">456 Main Street</div>
            </div>
          </div>
        </section>

        {/* Notifications and Preferences Section */}
        <section className="mb-4 mt-10">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black mb-5">Notifications & Preferences</h3>
            <button className="mb-5 text-gray-600 hover:text-blue-300 hover:border-blue-200 cursor-pointer text-sm border border-gray-300 p-2 py-1 rounded-lg"
              onClick={() => handleOpen(
                'Notifications & Preferences',
                [
                  { name: 'appointmentReminders', label: 'Appointment Reminders', type: 'select', options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }] },
                  { name: 'emailNotifications', label: 'Email Notifications', type: 'select', options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }] },
                  { name: 'smsNotifications', label: 'SMS Notifications', type: 'select', options: [{ value: 'enabled', label: 'Enabled' }, { value: 'disabled', label: 'Disabled' }] },
                ],
                {
                  appointmentReminders: 'enabled',
                  emailNotifications: 'enabled',
                  smsNotifications: 'enabled',
                }
              )}
            >update</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Appointment Reminders</label>
              <div className=" border border-gray-200 p-2 rounded mt-2 bg-brand-100 text-gray-500">Enabled</div>
            </div>
            <div>
              <label className="block text-gray-800">Email Notifications</label>
              <div className=" border border-gray-200 p-2 rounded mt-2 bg-brand-100 text-gray-500">Enabled</div>
            </div>
            <div>
              <label className="block text-gray-800">SMS Notifications</label>
              <div className=" border border-gray-200 p-2 rounded mt-2 bg-brand-100 text-gray-500">Disabled</div>
            </div>
          </div>
        </section>
        <UpdateModal
          open={open}
          handleClose={handleClose}
          section={currentSection}
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </div>

    </PatientLayout>
  );
};

export default Profile;
