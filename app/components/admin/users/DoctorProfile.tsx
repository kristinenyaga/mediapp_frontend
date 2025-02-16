"use client"
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Grid, Switch, Table, TableHead, TableBody, TableRow, TableCell, Paper, TableContainer, Select, MenuItem, CircularProgress } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import AdminLayout from "../AdminLayout";
import axios from "axios";
import { useParams } from "next/navigation";
import { STATUS_CODES } from "node:http";
import AppointmentsFilters from "./AppointmentFilters";
import TableData from "./TableData";
const DoctorProfile = () => {
  const { id } = useParams()
  const [doctor,setDoctor] = useState([])
  const [isActive, setIsActive] = useState(doctor?.status === "Active");
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([])
  const [filter, setFilter] = useState("week");

  const [appointmentFilters, setAppointmentFilters] = useState({
    dateFrom: "",
    dateTo: "",
    status: "",
    patientName: "",
  });

  const handleStatusToggle = () => {
    setIsActive(!isActive);
    // Call API to update status
  };

  const appointmentStats = {
    totalAppointments: doctor.appointments?.length,
    thisMonth: doctor?.appointments?.filter((a) => a.date.startsWith("2025-02")).length,
    thisWeek: doctor?.appointments?.filter((a) => a.date >= "2025-02-05").length,
    canceled: doctor?.appointments?.filter((a) => a.status === "canceled").length,
  };
  function getWeekNumber(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    return Math.ceil((date.getDate() + firstDayOfMonth.getDay()) / 7);
  }

  const groupAppointmentsByTime = () => {
    const today = new Date()
    today.toISOString().split("T")

    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay())); // Get last Sunday
    const currentWeekStartString = currentWeekStart.toISOString().split("T")[0];
    const currentMonth = today.getMonth(); // 0-based (Jan = 0, Feb = 1, ...)
    const currentYear = today.getFullYear();

    const grouped = {
      today: [{ day: 'Today', count: 0 }],
      week: [
        { day: 'Mon', count: 0 },
        { day: 'Tue', count: 0 },
        { day: 'Wed', count: 0 },
        { day: 'Thu', count: 0 },
        { day: 'Fri', count: 0 },
        { day: 'Sat', count: 0 },
        { day: 'Sun', count: 0 },
      ],
      month: [
        { day: 'week 1', count: 0 },
        { day: 'week 2', count: 0 },
        { day: 'week 3', count: 0 },
        { day: 'week 4', count: 0 }
      ]
    }

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    appointments.forEach(appointment => {
      const date = appointment.date
      const appointmentDate = new Date(date)
      const dayOfWeek = weekDays[appointmentDate.getDay()]
      const appointmentMonth = appointmentDate.getMonth();
      const appointmentYear = appointmentDate.getFullYear();

      if (appointmentMonth !== currentMonth || appointmentYear !== currentYear) {
        return;
      }
      
      if (date === today) {
        grouped.today[0].count++
      }

      if (date >= currentWeekStartString) {
        const weekEntry = grouped.week.find(d => d.day === dayOfWeek)
        if (weekEntry) {
          weekEntry.count++
        }
      }

      const weekNumber = getWeekNumber(appointmentDate);
      if (weekNumber >= 1 && weekNumber <= 4) {
        grouped.month[weekNumber-1].count++
      }
  })
    return grouped
  }

  const calculateAppointmentStatus = () => {
    
    const statusCounts = {
      today: {
        completed: 0,
        pending: 0,
        canceled:0
      },
      week: {
        completed: 0,
        pending: 0,
        canceled: 0
      },
      month: {
        completed: 0,
        pending: 0,
        canceled: 0
      }
    }

    const today = new Date()
    today.toISOString().split("T")
    const currentWeekStart = new Date(today.setDate(today.getDate() - today.getDay())); // Get last Sunday
    const currentWeekStartString = currentWeekStart.toISOString().split("T")[0];
    const currentMonth = today.getMonth() + 1; // Months are zero-based
    const currentYear = today.getFullYear();

    appointments.forEach(appointment => {
      const date = appointment.date
      const appointmentDate = new Date(date);
      const appointmentMonth = appointmentDate.getMonth() + 1;
      const appointmentYear = appointmentDate.getFullYear();

      if (date === today) {
        statusCounts.today[appointment.status]++
      }
      if (date >= currentWeekStartString) {
        statusCounts.week[appointment.status]++
      }
      if (appointmentMonth === currentMonth && appointmentYear === currentYear) {
        statusCounts.month[appointment.status]++;
      }

    })

    return {
      today: Object.entries(statusCounts.today).map(([status, count]) => ({ status, count })),
      week: Object.entries(statusCounts.week).map(([status, count]) => ({ status, count })),
      month: Object.entries(statusCounts.month).map(([status, count]) => ({ status, count }))

    }
  }

  const groupedAppointments = groupAppointmentsByTime();
  const appointmentStatusData = calculateAppointmentStatus();

  const filteredAppointments = groupedAppointments[filter];
  const filteredAppointmentStatus = appointmentStatusData[filter];

  const COLORS = ["#4CAF50", "#FF9800", "#F44336"];

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/doctor/${id}`);
        setDoctor(response.data);
        setIsActive(response.data.status === "active");
        setAppointments(response.data.appointments || [])
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDoctor();
    }
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <CircularProgress />
        </div>
      </AdminLayout>
    );
  }

  const columns = [
    { key: 'date', label: 'Date' },
    { key: 'startTime', label: 'Start Time' },
    { key: 'endTime', label: 'End Time' },
    { key: 'status', label: 'Status' },
    { key: 'patient', label: 'Patient' },

  ]


  return (
    <AdminLayout>
      <div className="w-[90%]">
        {/* Doctor Profile Section */}
        <Grid container spacing={3}>

          <Typography sx={{paddingLeft:3,paddingTop:2,marginTop:3}} variant="h5" fontWeight={500}>
            DR. {doctor.username}
          </Typography>
        
          {/* Appointment Statistics */}
          <Grid item xs={12} md={12} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              {[
                { title: "Total Appointments", value: appointmentStats.totalAppointments },
                { title: "This Month", value: appointmentStats.thisMonth },
                { title: "This Week", value: appointmentStats.thisWeek },
                { title: "Canceled", value: appointmentStats.canceled },
              ].map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <Card sx={{ borderRadius: "8px", boxShadow: "none", border: "1px solid #DFE1E0", textAlign: "center" }}>
                    <CardContent>
                      <Typography variant="body" color="textSecondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        {stat.value}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Charts Section */}
            <Grid container spacing={2} sx={{mt:2}}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={500} mb={2}>
                  Appointments over time
                </Typography>
                <Select value={filter} className="border bg-white mb-5 border-gray-300 rounded-md px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-500" onChange={(e) => setFilter(e.target.value)} size="small">
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                  <MenuItem value="month">This Month</MenuItem>
                </Select>
              {/* Chart */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={filteredAppointments}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4CAF50" />
                </BarChart>
              </ResponsiveContainer>

              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={500} mb={1}>
                  Appointment Status
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={filteredAppointmentStatus} dataKey="count" nameKey="status" outerRadius={80} label>
                      {filteredAppointmentStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>

              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Typography variant="h6" fontWeight={500} mt={4} mb={3}>
          All Appointments
        </Typography>
        <AppointmentsFilters filters={appointmentFilters} setFilters={setAppointmentFilters} />
        {/* <TableContainer component={Paper} sx={{ mt: 2, border: "1px solid #DFE1E0", boxShadow: "none", borderRadius: "8px" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Diagnosis</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.patient}</TableCell>
                  <TableCell>{appointment.date}</TableCell>
                  <TableCell>                    <span
                    style={{
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "5px",
                      backgroundColor:
                        appointment.status === "Completed"
                          ? "#C8E6C9"
                          : appointment.status === "Pending"
                            ? "#FFF3CD"
                            : "#F8D7DA",
                      color:
                        appointment.status === "Completed"
                          ? "#2E7D32"
                          : appointment.status === "Pending"
                            ? "#856404"
                            : "#D32F2F",
                    }}
                  >
                    {appointment.status}
                  </span></TableCell>
                  <TableCell>{appointment.diagnosis}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer> */}
        <TableData
          search=''
          filters={appointmentFilters}
          data={appointments}
          columns={columns}
          userType="appointment"
          name={doctor.username}
        />

      </div>
    </AdminLayout>
  );
};

export default DoctorProfile;
