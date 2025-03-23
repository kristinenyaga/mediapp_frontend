"use client";
import { useState, useEffect } from "react";
import AdminLayout from "../AdminLayout";
import { MdOutlineModeEdit, MdCheckCircle, MdCancel } from "react-icons/md";

import api from "@/app/utils/axiosInstance";
import LoadingScreen from "../../loader/Loader";

const Profile = () => {
  const [adminData, setAdminData] = useState({
    username: "Admin Name",
    email: "admin@example.com",
    phone: "+254700000000",
    role: "Super Admin",
    profilePicture: "/default-avatar.png",
  });

  // const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState(adminData);

  // Fetch Profile Info
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const response = await api.get("/api/admin/profile");
        setAdminData(response.data);
        setUpdatedData(response.data);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);


  // Handle Profile Updates
  const handleUpdateProfile = async () => {
    try {
      const response = await api.put("/api/admin/profile", updatedData);
      if (response.status === 200) {
        setAdminData(updatedData);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <AdminLayout>
      <div className="">
        <h2 className="text-2xl font-medium text-gray-800 mb-5">Profile</h2>

        {/* Profile Card */}
        <div className="bg-white shadow-md rounded-lg mb-6">
          <div className="mt-6 space-y-3">
            <div>
              <label className="text-gray-600">Full Name</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                value={updatedData.username}
                onChange={(e) => setUpdatedData({ ...updatedData, username: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-gray-600">Phone Number</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1"
                value={updatedData.phone}
                onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="text-gray-600">Email (Cannot be changed)</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg mt-1 bg-gray-100 cursor-not-allowed"
                value={adminData.email}
                disabled
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex gap-4">
            {isEditing ? (
              <>
                <button onClick={handleUpdateProfile} className="px-5 py-2 bg-green-600 text-white rounded-md flex items-center gap-2">
                  <MdCheckCircle /> Save
                </button>
                <button onClick={() => setIsEditing(false)} className="px-5 py-2 bg-red-500 text-white rounded-md flex items-center gap-2">
                  <MdCancel /> Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="px-5 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2">
                <MdOutlineModeEdit /> Edit Profile
              </button>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Profile;
