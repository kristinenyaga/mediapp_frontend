"use client"
import React from "react";
import AdminLayout from "../AdminLayout";
import "chart.js/auto";

const System = () => {
  // Dummy accuracy score
  const accuracy = 92.5;

  // Sample classification report data
  const classificationReport = [
    { disease: "Diabetes", precision: 0.91, recall: 0.89, f1Score: 0.90 },
    { disease: "Hypertension", precision: 0.87, recall: 0.85, f1Score: 0.86 },
    { disease: "Malaria", precision: 0.94, recall: 0.93, f1Score: 0.93 },
    { disease: "Pneumonia", precision: 0.88, recall: 0.86, f1Score: 0.87 },
  ];

  // Unique diseases the model can predict
  const diseases = ["Diabetes", "Hypertension", "Malaria", "Pneumonia"];

  // Data for bar chart (F1-score per disease)
  const barChartData = {
    labels: classificationReport.map((item) => item.disease),
    datasets: [
      {
        label: "F1 Score",
        data: classificationReport.map((item) => item.f1Score),
        backgroundColor: ["#3b82f6", "#f97316", "#22c55e", "#eab308"],
      },
    ],
  };

  // Data for accuracy donut chart
  const doughnutChartData = {
    labels: ["Correct Predictions", "Incorrect Predictions"],
    datasets: [
      {
        data: [accuracy, 100 - accuracy],
        backgroundColor: ["#10b981", "#ef4444"],
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="w-[90%]">
        <h1 className="text-2xl font-semibold mb-4 text-blue-700 ">Model Information & Metrics</h1>

        {/* Model Overview */}
        <div className="bg-white mb-6">
          <h2 className="text-xl font-medium mb-2">Model Overview</h2>
          <p>
            This AI model predicts diseases based on patient symptoms using machine learning. It has been trained on a
            large dataset of medical records to provide reliable predictions.
          </p>
        </div>
          <div className="flex gap-10 items-center">
            <h2 className="text-xl font-medium mb-2">Accuracy</h2>
            <p className="mt-2 text-center font-semibold">{accuracy}% Accuracy</p>
          </div>


        {/* Classification Report */}
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Classification Report</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2">Disease</th>
                <th className="border border-gray-300 p-2">Precision</th>
                <th className="border border-gray-300 p-2">Recall</th>
                <th className="border border-gray-300 p-2">F1 Score</th>
              </tr>
            </thead>
            <tbody>
              {classificationReport.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2">{item.disease}</td>
                  <td className="border border-gray-300 p-2">{(item.precision * 100).toFixed(1)}%</td>
                  <td className="border border-gray-300 p-2">{(item.recall * 100).toFixed(1)}%</td>
                  <td className="border border-gray-300 p-2">{(item.f1Score * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Unique Diseases */}
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Diseases the Model Can Predict</h2>
          <ul className="list-disc pl-5">
            {diseases.map((disease, index) => (
              <li key={index} className="font-medium">{disease}</li>
            ))}
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default System;
