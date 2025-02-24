"use client";
import React, { useEffect, useState } from "react";
import PatientLayout from "../patientLayout";
import api from "@/app/utils/axiosInstance";
import LoadingScreen from "../../loader/Loader";
import { useRole } from "@/app/context/RoleContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { role } = useRole();

  useEffect(() => {
    setIsLoading(true);
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/api/notifications/", {
          _role: role,
        });
        setNotifications(response.data.notifications);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (isLoading) return <LoadingScreen />;

  return (
    <PatientLayout>
      <h1 className="text-2xl font-medium text-blue-700">Notifications</h1>
      <p className="text-gray-500 text-sm">
        These are all notifications about your appointments
      </p>
      <div className="grid grid-cols-1 mt-10 md:grid-cols-2 lg:grid-cols-3 gap-5 w-[90%]">
        {notifications?.map((notification, index) => (
          <div
            key={index}
            className={`border border-gray-300 rounded-lg p-4 bg-white flex flex-col gap-2 hover:bg-blue-50 transition-colors relative`}
          >
            <div className='w-5 h-5 bg-brand-300 rounded-full absolute -right-[2px] -top-[2px]'></div>
            <div
              className={`text-base font-medium ${notification.type === "urgent"
                  ? "text-red-600"
                  : "text-blue-700"
                }`}
            >
              {notification.type}
            </div>
            <p className=" text-sm text-gray-700">{notification.message}</p>
            <p className="text-xs text-brand-600 mt-2 font-medium">
              <span className="text-gray-500"></span> {new Intl.DateTimeFormat("en-US", {
                month: "short", day: "numeric", year: "numeric",
              }).format(new Date(notification.createdAt))}

            </p>
          </div>
        ))}
      </div>
    </PatientLayout>
  );
};

export default Notifications;
