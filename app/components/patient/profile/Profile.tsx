"use client";
import React, { useEffect, useState } from "react";
import PatientLayout from "../patientLayout";
import UpdateModal from "./UpdateModal";
import { useAuth } from "@/app/context/authContext";
import { Notify } from "notiflix";
import api from "@/app/utils/axiosInstance";
import LoadingScreen from "../../loader/Loader";
interface EmergencyContact {
  id: number;
  patientId: number;
  name: string;
  relationship: string;
  phone: string | null;
  updatedAt: string;
}

interface MedicalInformation {
  allergies?: string;
  medications?: string;
}

interface ProfileDetails {
  id:number,
  username: string;
  email: string;
  dob:Date,
  phone: string | null;
  emergencycontact?: EmergencyContact;
  medicalinformation?: MedicalInformation;
}

const Profile = () => {
  const [open, setOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState("");
  const [fields, setFields] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const { user } = useAuth()
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);

  const handleOpen = (section, fieldsData, initialValuesData) => {
    setCurrentSection(section);
    setFields(fieldsData);
    setInitialValues(initialValuesData);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async (updatedValues) => {
    let payload = {}
    switch (currentSection) {
      case "Personal Information":
        payload = {
          patient: {
            username: updatedValues?.fullName || profileDetails?.username,
            email: updatedValues?.email || profileDetails?.email,
            phone: updatedValues?.phone || profileDetails?.phone,
          },
        };
        break
      case 'Health Information':
        payload = {
          medicalInformation: {
            allergies: updatedValues.allergies || profileDetails?.medicalinformation?.allergies,
            medications: updatedValues.medications || profileDetails?.medicalinformation?.medications,
          }
        }
        break
      case 'Emergency Contact':
        payload = {
          emergencyContact: {
            name: updatedValues.name || emergencyContact?.name,
            relationship: updatedValues.relationship || emergencyContact?.relationship,
            phone: updatedValues.phone || emergencyContact?.phone,
          }
        }

    }
    try {
      await api.patch(`/api/patient/${profileDetails?.id}`, payload);
      const response = await api.get('/api/patient/profile');
      setProfileDetails(response.data);
      setOpen(false)
      Notify.success('updated succesfully')
    }
    catch (error) {
      Notify.failure(error)
    }
  };
  useEffect(() => {
    const fetchProfileDetails = async () => {
      const response = await api.get('/api/patient/profile');
      
      setProfileDetails(response.data);
    }
    fetchProfileDetails()
  },[])
  if (!profileDetails) return <LoadingScreen />;
  const emergencyContact = profileDetails?.emergencycontact
  return (
    <PatientLayout>
      <div className="w-[90%]">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-3xl font-medium text-blue-700">Profile Information</h2>
            <p className="text-base text-gray-500 mb-6">View and update your profile details</p>
          </div>
        </div>

        {/* Personal Information Section */}
        <section className="border border-gray-2 p-5 rounded-lg mb-6">
          <div className="flex gap-5 items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
            <button
              className="text-sm px-3 py-2 bg-blue-100 text-blue-600 rounded-lg"
              onClick={() =>
                handleOpen(
                  "Personal Information",
                  [
                    { name: "fullName", label: "Full Name", required: true },
                    { name: "email", label: "Email", type: "email", required: true },
                    { name: "phone", label: "Phone", required: true },
                  ],
                  {
                    fullName: profileDetails?.username || "",
                    email: profileDetails?.email || "",
                    phone: profileDetails?.phone || "",
                  }
                )
              }
            >
              Update
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Full Name" value={profileDetails?.username} />
            <InfoField label="Email" value={profileDetails?.email} />
            <InfoField label="Phone" value={profileDetails?.phone || "N/A"} />
            <InfoField label="Date Of Birth" value={profileDetails?.dob || "N/A"} />

          </div>
        </section>

        {/* Health Information Section */}
        <section className="border border-gray-200 p-5 rounded-lg mb-6">
          <div className="flex gap-5 items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Health Information</h3>
            <button
              className="text-sm px-3 py-2 bg-blue-100 text-blue-600 rounded-lg"
              onClick={() =>
                handleOpen(
                  "Health Information",
                  [
                    { name: "allergies", label: "Allergies" },
                    { name: "medications", label: "Ongoing Medications" },
                  ],
                  {
                    allergies: profileDetails?.medicalinformation?.allergies || "No allergies provided",
                    medications: profileDetails?.medicalinformation?.medications || "No ongoing medications",
                  }
                )
              }
            >
              Update
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Allergies" value={profileDetails?.medicalinformation?.allergies || "No allergies provided"} />
            <InfoField label="Ongoing Medications" value={profileDetails?.medicalinformation?.medications || "No ongoing medications"} />
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section className="border border-gray-2 p-5 rounded-lg">
          <div className="flex gap-5 items-center mb-4">
            <h3 className="text-lg font-medium text-gray-800">Emergency Contact</h3>
            <button
              className="text-sm px-3 py-2 bg-blue-100 text-blue-600 rounded-lg"
              onClick={() =>
                handleOpen(
                  "Emergency Contact",
                  [
                    { name: "name", label: "Full Name", required: true },
                    { name: "relationship", label: "Relationship", required: true },
                    { name: "phone", label: "Phone", required: true },
                  ],
                  {
                    name: profileDetails?.emergencycontact?.name || "",
                    relationship: profileDetails?.emergencycontact?.relationship || "",
                    phone: profileDetails?.emergencycontact?.phone || "",
                  }
                )
              }
            >
              Update
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InfoField label="Name" value={profileDetails?.emergencycontact?.name || "Not provided"} />
            <InfoField label="Relationship" value={profileDetails?.emergencycontact?.relationship || "Not provided"} />
            <InfoField label="Phone" value={profileDetails?.emergencycontact?.phone || "Not provided"} />
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
const InfoField = ({ label, value }) => (
  <div>
    <label className="block text-gray-600 text-sm">{label}</label>
    <div className="border border-gray-300 p-2 rounded mt-1 text-gray-600">{value}</div>
  </div>
);

export default Profile;
