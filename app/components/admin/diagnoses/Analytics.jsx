"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, BarChart, Bar, Legend } from "recharts";
import ReportHeader from "./ReportsHeader";
import api from "@/app/utils/axiosInstance";
import { useEffect, useState } from "react";
import LoadingScreen from "../../loader/Loader";
import moment from "moment";
import { generateReport } from './generateReport'
import AdminLayout from "../AdminLayout";

const COLORS = ["#1d4ed8", "#6B4DE6", "#FFBB28", "#FF8042"];

const Analytics = () => {
  const [feedback, setFeedback] = useState([]);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("currentMonth");
  const [symptomData, setSymptomsData] = useState([])

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get("/api/feedback/");
        setFeedback(response.data.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const response = await api.get("/api/diagnosis/");
        setDiagnoses(response.data.data);
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiagnoses();
  }, []);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const response = await api.get("/api/patientsymptoms/");
        setSymptomsData(response.data.data);
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      }
    };
    fetchSymptoms();
  }, []);


  // --- Filter Logic ---
  const filterDataByDate = (data) => {
    const now = moment();
    return data.filter((item) => {
      const itemDate = moment(item.createdAt);
      if (filter === "currentMonth") return itemDate.isSame(now, "month");
      if (filter === "thisWeek") return itemDate.isSame(now, "week");
      if (filter === "otherMonths") return !itemDate.isSame(now, "month"); // Show all except current month
      return true;
    });
  };

  const filteredDiagnoses = filterDataByDate(diagnoses);
  const filteredFeedback = filterDataByDate(feedback);

  // --- Generate Dynamic Data ---
  const totalPredictedDiagnoses = filteredDiagnoses.length;
  const doctorOverriddenDiagnoses = filteredDiagnoses.filter(item => !item.isApproved).length;
  const totalFeedbackGiven = filteredFeedback.length;
  const averageRating =
    filteredFeedback.length > 0
      ? (filteredFeedback.reduce((acc, curr) => acc + curr.rating, 0) / filteredFeedback.length).toFixed(1)
      : 0;

  const diagnosisCounts = filteredDiagnoses.reduce((acc, curr) => {
    acc[curr.predictedDiagnosis] = (acc[curr.predictedDiagnosis] || 0) + 1;
    return acc;
  }, {});
  const diagnosisData = Object.entries(diagnosisCounts).map(([key, value]) => ({
    name: key,
    value,
  }));

  const aiApprovalData = [
    { name: "Approved", value: filteredDiagnoses.filter(d => d.isApproved).length },
    { name: "Overridden", value: filteredDiagnoses.filter(d => !d.isApproved).length },
  ];

  const feedbackGroupedByMonth = filteredFeedback.reduce((acc, curr) => {
    const month = moment(curr.createdAt).format("MMM");
    if (!acc[month]) acc[month] = { month, ratingTotal: 0, count: 0 };
    acc[month].ratingTotal += curr.rating;
    acc[month].count += 1;
    return acc;
  }, {});

  const satisfactionData = Object.values(feedbackGroupedByMonth).map(item => ({
    month: item.month,
    rating: item.count > 0 ? (item.ratingTotal / item.count).toFixed(1) : 0,
  }));

  const feedbackAppointmentsTrend = Object.values(feedbackGroupedByMonth).map(item => ({
    month: item.month,
    feedbackGiven: item.count,
  }));

  if (loading) return <LoadingScreen />;
  return (
    <AdminLayout>
      <div>
        <ReportHeader
          totalPredictedDiagnoses={totalPredictedDiagnoses}
          doctorOverriddenDiagnoses={doctorOverriddenDiagnoses}
          totalFeedbackGiven={totalFeedbackGiven}
          averageRating={averageRating}
        />

        {/* Filter Dropdown */}
        <div className="mb-6">
          <label className="text-lg font-semibold mr-2">Filter By:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded-lg"
          >
            <option value="thisWeek">This Week</option>
            <option value="currentMonth">Current Month</option>
            <option value="otherMonths">Other Months</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-10 w-[90%]">
          {/* Diagnosis Distribution */}
          <div className="mb-8 shadow-md p-5">
            <h3 className="text-xl font-semibold mb-3">Diagnosis Distribution</h3>
            <p className="text-gray-600 text-sm mb-4">
              This chart shows the percentage of different diagnoses made over a given period.
              It helps identify the most common conditions among patients.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={diagnosisData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {diagnosisData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* AI Approval vs. Disapproval */}
          <div className="mb-8 shadow-md p-5">
            <h3 className="text-xl font-semibold mb-3">Doctor’s Approval vs. Disapproval of AI-Predicted Diagnoses</h3>
            <p className="text-gray-600 text-sm mb-4">
              This chart compares the number of AI-predicted diagnoses that were approved
              versus those disapproved by the doctor.
            </p>
            <button onClick={() => generateReport(symptomData, diagnoses)} className="text-sm bg-blue-50 text-blue-600 p-2 font-medium rounded-md">Download Report</button>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={aiApprovalData} dataKey="value" cx="50%" cy="50%" outerRadius={100} label>
                  {aiApprovalData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Satisfaction Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-[90%]">
          <div className="mb-8 shadow-md p-5">
            <h3 className="text-xl font-semibold mb-3">Patient Satisfaction Ratings</h3>
            <p className="text-gray-600 text-sm mb-4">
              This chart shows the average patient ratings over time, helping track satisfaction trends.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={satisfactionData}>
                <XAxis dataKey="month" />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Bar dataKey="rating" fill="#6B4DE6" barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Feedback Appointments Trend */}
          <div className="mb-8 shadow-md p-5">
            <h3 className="text-xl font-semibold mb-3">Appointments with Feedback Trend</h3>
            <p className="text-gray-600 text-sm mb-4">
              This chart tracks the number of appointments where patients provided feedback over time.
            </p>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={feedbackAppointmentsTrend}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="feedbackGiven" stroke="#6B4DE6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Analytics;
