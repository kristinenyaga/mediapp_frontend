"use client";
import React, { useEffect, useState } from "react";
import PatientLayout from "../patientLayout";
import UpdateModal from "./UpdateModal";
import { useAuth } from "@/app/context/authContext";
import axios from "axios";
import { Notify } from "notiflix";
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
    console.log(`Updated ${currentSection}:`, updatedValues);
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
      const response = await axios.patch(`http://localhost:5000/api/patient/${profileDetails?.id}`, payload, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` }
      });
      setProfileDetails((prev) => ({
        ...prev,
        ...response.data
      }))
      setOpen(false)
      Notify.success('updated succesfully')
    }
    catch (error) {
      Notify.failure(error)
    }
  };
  useEffect(() => {
    const fetchProfileDetails = async () => {
      const response = await axios.get('http://localhost:5000/api/patient/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
      });
      
      setProfileDetails(response.data);
    }
    fetchProfileDetails()
  },[profileDetails])
  if (!profileDetails) return <p>Loading...</p>;
  const emergencyContact = profileDetails?.emergencycontact
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
                ],
                {
                  fullName: profileDetails?.username || '',
                  email: profileDetails?.email || '',
                  phone: profileDetails?.phone || '',
                }
              )
            }>update</button>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-28 bg-gray-300 rounded-full flex justify-center items-center text-black text-xl font-medium uppercase">{profileDetails?.username.split('')[0]}</div>
            <div className="grid grid-cols-2 gap-4 text-sm w-full">
              <div>
                <label className="block text-gray-800">Full Name</label>
                <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.username}</div>
              </div>
              <div>
                <label className="block text-gray-800">Email</label>
                <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{ profileDetails?.email}</div>
              </div>
              <div>
                <label className="block text-gray-800">Phone</label>
                <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">
                  {profileDetails?.phone ? profileDetails.phone : 'Nan'}
                </div>
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
                  allergies: profileDetails?.medicalinformation?.allergies || '',
                  medications: profileDetails?.medicalinformation?.medications || '',
                }
              )
            }>update</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Allergies</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.medicalinformation?.allergies ?? 'No allergies provided'}</div>
            </div>
            <div>
              <label className="block text-gray-800">Ongoing Medications</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.medicalinformation?.medications ?? 'No ongoing medications'}</div>
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
                  { name: "relationship", label: "Relationship", required: true },
                  { name: "phone", label: "Phone", required: true },
                ],
                {
                  name: emergencyContact?.name || '',
                  relationship: emergencyContact?.relationship || '',
                  phone: emergencyContact?.phone || '',
                }
              )}
            >update</button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Name</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{emergencyContact?.name}</div>
            </div>
            <div>
              <label className="block text-gray-800">Relationship</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{emergencyContact?.relationship}</div>
            </div>
            <div>
              <label className="block text-gray-800">Phone</label>
              <div className=" border border-gray-300 p-2 rounded mt-2 text-gray-500">{emergencyContact?.phone}</div>
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
