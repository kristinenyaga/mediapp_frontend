"use client";
import React from "react";
import AdminLayout from "../AdminLayout";
import "chart.js/auto";

// Disease mapping based on classification report
const diseaseMap = {
  0: "AIDS", 1: "Acne", 2: "Alcoholic Hepatitis", 3: "Allergy", 4: "Arthritis",
  5: "Bronchial Asthma", 6: "Cervical Spondylosis", 7: "Chickenpox", 8: "Chronic Cholestasis", 9: "Common Cold",
  10: "Dengue", 11: "Diabetes", 12: "Dimorphic Hemmorhoids (Piles)", 13: "Drug Reaction", 14: "Fungal Infection",
  15: "GERD", 16: "Gastroenteritis", 17: "Heart Attack", 18: "Hepatitis A", 19: "Hepatitis B",
  20: "Hepatitis C", 21: "Hepatitis D", 22: "Hepatitis E", 23: "Hypertension", 24: "Hyperthyroidism",
  25: "Hypoglycemia", 26: "Hypothyroidism", 27: "Impetigo", 28: "Jaundice", 29: "Malaria",
  30: "Migraine", 31: "Osteoarthritis", 32: "Paralysis (Brain Hemorrhage)", 33: "Peptic Ulcer Disease", 34: "Pneumonia",
  35: "Psoriasis", 36: "Tuberculosis", 37: "Typhoid", 38: "Urinary Tract Infection", 39: "Varicose Veins",
  40: "Vertigo"
};

// Example classification report with real values (from the screenshot)
const classificationReport = [
  { id: 0, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 1, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 2, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 3, precision: 1.0, recall: 0.25, f1Score: 0.40 },
  { id: 4, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 5, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 6, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 7, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 8, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 9, precision: 0.57, recall: 1.0, f1Score: 0.73 },
  { id: 10, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 11, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 12, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 13, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 14, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 15, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 16, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 17, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 18, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 19, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 20, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 21, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 22, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 23, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 24, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 25, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 26, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 27, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 28, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 29, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 30, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 31, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 32, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 33, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 34, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 35, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 36, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 37, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 38, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 39, precision: 1.0, recall: 1.0, f1Score: 1.0 },
  { id: 40, precision: 1.0, recall: 1.0, f1Score: 1.0 },
];


// Get all unique diseases the model can predict
const diseases = Object.values(diseaseMap);

const System = () => {
  const accuracy = 98.91; // Accuracy from the screenshot

  return (
    <AdminLayout>
      <div className="w-[90%]">
        <h1 className="text-2xl font-semibold mb-4 text-blue-700">Model Information & Metrics</h1>

        {/* Model Overview */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h2 className="text-xl font-medium mb-2">Model Overview</h2>
          <p>
            This AI model predicts diseases based on patient symptoms using machine learning. It has been trained on a large dataset
            of medical records to provide reliable predictions.
          </p>
        </div>

        {/* Accuracy */}
        <div className="flex gap-10 items-center">
          <h2 className="text-xl font-medium">Accuracy</h2>
          <p className="mt-2 text-center font-semibold">{accuracy}% Accuracy</p>
        </div>

        {/* Classification Report */}
<div className="bg-white p-4 rounded-lg shadow mt-6">
  <h2 className="text-xl font-semibold mb-2">Classification Report</h2>
  
  {/* Scrollable Table Container */}
  <div className=" max-h-80 overflow-auto border border-gray-300 rounded">
    <table className="w-full border-collapse">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-300 p-2">Disease</th>
          <th className="border border-gray-300 p-2">Precision</th>
          <th className="border border-gray-300 p-2">Recall</th>
          <th className="border border-gray-300 p-2">F1 Score</th>
        </tr>
      </thead>
      <tbody>
        {classificationReport.map(({ id, precision, recall, f1Score }) => (
          <tr key={id} className="text-center">
            <td className="border border-gray-300 p-2">{diseaseMap[id]}</td>
            <td className="border border-gray-300 p-2">{(precision * 100).toFixed(1)}%</td>
            <td className="border border-gray-300 p-2">{(recall * 100).toFixed(1)}%</td>
            <td className="border border-gray-300 p-2">{(f1Score * 100).toFixed(1)}%</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


        {/* Unique Diseases */}
        <div className="bg-white p-4 rounded-lg shadow mt-6">
          <h2 className="text-xl font-semibold mb-2">Diseases the Model Can Predict</h2>
          <div className="max-h-40 overflow-auto border p-2 rounded-md">
            <ul className="list-disc pl-5">
              {diseases.map((disease, index) => (
                <li key={index} className="font-medium">{disease}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default System;
