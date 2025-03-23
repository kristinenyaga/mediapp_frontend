"use client";
import React, { useEffect, useState } from "react";
import DoctorLayout from "../doctorLayout";
import axios from "axios";
import UpdateModal from "./UpdateModal";
import WorkingHoursModal from "./WorkingHoursModal";
import { Notify } from "notiflix";
import LoadingScreen from "../../loader/Loader";

const Profile = () => {
  const [openHoursModal, setOpenHoursModal] = useState(false);
  const [workingHours, setWorkingHours] = useState([]);
  const [sameHours, setSameHours] = useState(false);
  const [profileDetails, setProfileDetails] = useState(null);
  const [currentSection, setCurrentSection] = useState("");
  const [fields, setFields] = useState([]);
  const [initialValues, setInitialValues] = useState({});
  const [open, setOpen] = useState(false);
  const [isloading,setIsLoading] = useState(false)
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleOpen = (section, fieldsData, initialValuesData) => {
    setCurrentSection(section);
    setFields(fieldsData);
    setInitialValues(initialValuesData);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleWorkingHoursClose = () => setOpenHoursModal(false);

const handleWorkingHourChange = (day, field, value) => {
  const updatedHours = workingHours.map((hour) => {
    if (hour.dayOfWeek === day) {
      return {
        ...hour,
        [field]: value,
      };
    }
    return hour;
  });
  setWorkingHours(updatedHours);
};

  const applySameHours = (start, end) => {
    const updatedHours = daysOfWeek.map((day) => ({
      day,
      startTime: start,
      endTime: end,
    }));
    setWorkingHours(updatedHours);
  };

  // dedeplicate logic
  const deduplicateWorkingHours = (hours) => {
    const uniqueHours ={}
    hours.forEach(hour =>{
      uniqueHours[hour.dayOfWeek] = hour
    })
    return Object.values(uniqueHours)
  }

  const handleSaveWorkingHours = async () => {
    console.log("Updated Working Hours:", workingHours);
    const deduplicatedHours = (deduplicateWorkingHours(workingHours))
    try {
      const response = await axios.post('http://localhost:5000/api/workingHours',deduplicatedHours,{
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
      });
      console.log(response.data)
      Notify.success('updated succesfully')
      
    } catch (error) {
      Notify.failure(error)
    }
    setOpenHoursModal(false);

  };

  useEffect(() => {
    setIsLoading(true)
    const fetchProfileDetails = async () => {
      const response = await axios.get('http://localhost:5000/api/doctor/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('access_token')}` },
      });

      setProfileDetails(response.data);
      if (response.data.workinghours) {
        setWorkingHours(response.data.workinghours);
      }
      setIsLoading(false)
    };
    fetchProfileDetails();
  }, []);

  const handleSubmit = async (updatedValues) => {
    console.log(`Updated ${currentSection}:`, updatedValues);
    let payload = {}
    switch (currentSection) {
      case "Personal Information":
        payload = {
          section: "Personal Information",
          updatedValues: {
            fullName: updatedValues?.fullName || profileDetails?.username,
            email: updatedValues?.email || profileDetails?.email,
            phone: updatedValues?.phone || profileDetails?.phone
          }
        };
        break
      case "Proffesional Information":
        payload = {
          section: "Proffesional Information",
          updatedValues: {
            specialization: updatedValues?.specialization || profileDetails?.specialization,
            yearsOfExperience: updatedValues?.yearsOfExperience || profileDetails?.yearsOfExperience,
            roomNumber: updatedValues?.roomNumber || profileDetails?.room_number
          }
        }
        break

    }
    try {
      const response = await axios.patch(`http://localhost:5000/api/doctor/update`, payload, {
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
  if(isloading) return <LoadingScreen />
  return (
    <DoctorLayout>
      <div>
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
              onClick={() => {
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
              }}
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Full Name</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.username}</div>
            </div>
            <div>
              <label className="block text-gray-800">Email</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.email}</div>
            </div>
            <div>
              <label className="block text-gray-800">Phone</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.phone}</div>
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
                  "Proffesional Information",
                  [
                    { name: "specialization", label: "Specialization" },
                    { name: "yearsOfExperience", label: "Years Of Experience" },
                    {name:"roomNumber",label:'Room Number'}
                  ],
                  {
                    specialization: profileDetails?.specialization || '',
                    yearsOfExperience: profileDetails?.yearsOfExperience || '',
                    roomNumber: profileDetails?.room_number || ''
                  }

                )
              }
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-800">Specialization</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.specialization || 'None'}</div>
            </div>
            <div>
              <label className="block text-gray-800">Years of Experience</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.yearsOfExperience || 'None'}</div>
            </div>
            <div>
              <label className="block text-gray-800">Room Number</label>
              <div className="border border-gray-300 p-2 rounded mt-2 text-gray-500">{profileDetails?.room_number || 'None'}</div>
            </div>
          </div>
        </section>

        {/* Availability Section */}
        <section className="mb-8">
          <div className="flex items-center gap-5">
            <h3 className="text-base font-medium text-black">Working Hours</h3>
            <button
              className="text-gray-600 hover:text-blue-300 border border-gray-300 p-2 py-1 rounded-lg text-sm"
              onClick={() => setOpenHoursModal(true)}
            >
              Update
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
            {workingHours.map((hour) => (
              <div key={hour.dayOfWeek} className="flex items-center gap-3">
                <span className="w-24">{hour.dayOfWeek}</span>
                <span className="text-gray-500">{hour.startTime || "N/A"} - {hour.endTime || "N/A"}</span>
              </div>
            ))}
          </div>
        </section>
        <WorkingHoursModal
          open={openHoursModal}
          handleClose={handleWorkingHoursClose}
          sameHours={sameHours}
          setSameHours={setSameHours}
          applySameHours={applySameHours}
          handleSaveWorkingHours={handleSaveWorkingHours}
          daysOfWeek={daysOfWeek}
          workingHours={workingHours}
          handleWorkingHourChange={handleWorkingHourChange}
        />

        <UpdateModal
          open={open}
          handleClose={handleClose}
          section={currentSection}
          fields={fields}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        />
      </div>
    </DoctorLayout>
  );
};

export default Profile;
