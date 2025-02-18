"use client"
import React from 'react'
import AdminLayout from '../AdminLayout'
import { Box, Card, CardContent, Grid, Grid2, Typography } from '@mui/material'
import { FaChartBar, FaClipboardList, FaStethoscope, FaUserInjured } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, CartesianGrid } from "recharts";

const Diagnoses = () => {
  const stats = [
    { title: "Total Diagnoses", value: 120, icon: <FaChartBar size={24} color="#2D9CDB" />, color: "#E3F2FD" },
    { title: "Most Common Diagnosis", value: "Flu", icon: <FaStethoscope size={24} color="#27AE60" />, color: "#E9F7EF" },
    { title: "Most Reported Symptom", value: "Cough", icon: <FaUserInjured size={24} color="#F2994A" />, color: "#FEF4E8" },
    { title: "Total Appointments with Symptoms", value: 250, icon: <FaClipboardList size={24} color="#BB6BD9" />, color: "#F5E6FC" },
  ];

  const data = [
    { ageGroup: "0-18 years", Flu: 30, Asthma: 20, Diabetes: 5 },
    { ageGroup: "19-35 years", Flu: 40, Asthma: 10, Diabetes: 15 },
    { ageGroup: "36-50 years", Flu: 25, Asthma: 5, Diabetes: 20 },
    { ageGroup: "51+ years", Flu: 10, Asthma: 5, Diabetes: 30 },
  ];
  return (
    <AdminLayout>
      <Grid2 container spacing={3} flexDirection={'column'} sx={{ width: '90%' }}>
        <Typography sx={{ mt: 2, fontSize: '24px', fontWeight: 500, color:'#6B4DE6' }} variant="h5" fontWeight={500}>
          Diagnosis analytics
        </Typography>
        <Grid item xs={12} md={12} sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card sx={{ borderRadius: "12px", border:'1px solid #DFE1E0', boxShadow: 'none' }}>
                  <CardContent sx={{ textAlign: "center" }}>
                    <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                      {stat.icon}
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#6A6F6D",fontSize:'16px' }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#363D3A', fontSize: '20px' }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" fontWeight={500} mt={3} >
                Top 5 diagnoses this month
              </Typography>
              <ResponsiveContainer width="50%" height={250}>
                <BarChart
                  width={500}
                  height={300}
                  data={data}
                  margin={{
                    top: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Flu" stackId="a" fill="#6B4DE6" />
                  <Bar dataKey="Asthma" stackId="a" fill="#27AE60" />
                </BarChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>

        </Grid>
      </Grid2>
    </AdminLayout>
  )
}

export default Diagnoses