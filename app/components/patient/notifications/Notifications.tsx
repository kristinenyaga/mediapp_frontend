"use client";
import React, { useEffect, useState } from "react";
import PatientLayout from "../patientLayout";
import api from "@/app/utils/axiosInstance";
import LoadingScreen from "../../loader/Loader";
import { useRole } from "@/app/context/RoleContext";
import { MdEventBusy } from "react-icons/md";

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
      <h1 className="text-3xl font-medium text-blue-700">Notifications</h1>
      <p className="text-gray-500 text-base">
        These are all notifications about your appointments
      </p>
      {
        notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 bg-gray-100 rounded-lg p-6 shadow-md">
            {/* Icon */}
            <MdEventBusy className="text-blue-700 text-6xl" />
            {/* Message */}
            <h2 className="text-lg font-semibold text-gray-800 mt-4">
              No Notifications Found
            </h2>
            <p className="text-gray-600 text-center mt-2">
              You don’t have any notifications yet.
            </p>
          </div>
        ): (
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
        )
      }

    </PatientLayout>
  );
};

export default Notifications;
