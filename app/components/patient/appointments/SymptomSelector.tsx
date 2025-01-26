import React, { useState } from 'react';
import Select from 'react-select'; // Ensure react-select is installed

const SymptomSelector = ({ symptoms, onSubmit }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const symptomOptions = symptoms?.map((symptom) => ({
    label: symptom.name, 
    value: symptom.id,  
  }));

  // Handle adding a symptom
  const handleAddSymptom = (selectedOption) => {
    if (selectedOption) {
      setSelectedSymptoms((prev) => [...prev, selectedOption]);
    }
  };

  // Handle removing a symptom
  const handleRemoveSymptom = (symptomValue) => {
    setSelectedSymptoms(selectedSymptoms?.filter((symptom) => symptom.value !== symptomValue));
  };

  const handleSubmit = () => {
    const symptomList = selectedSymptoms?.map((symptom) => symptom.value); // Send symptom IDs
    onSubmit({ symptomList, additionalInfo });
  };

  // Filter out already selected symptoms from the dropdown
  const filteredOptions = symptomOptions.filter(
    (option) => !selectedSymptoms?.some((symptom) => symptom.value === option.value)
  );

  return (
    <div className="mt-14 max-w-[90%]">
      <h2 className="text-lg mb-4 text-blue-600 font-medium">Select Symptoms</h2>

      {/* Symptom Selector */}
      <Select
        options={filteredOptions}
        onChange={(selectedOption) => {
          handleAddSymptom(selectedOption);
        }}
        placeholder="Search and select symptoms..."
        className="mb-4 focus:outline-none"
        isClearable
        value={null}
        styles={{
          control: (base) => ({
            ...base,
            padding: '0.2rem 0',
          }),
          menu: (base) => ({
            ...base,
            zIndex: 100,
          }),
        }}
      />

      {/* Selected Symptoms Display */}
      <div className="mt-8">
        <h3 className="text-gray-600 font-medium mb-2">Selected Symptoms:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms?.map((symptom) => (
            <span
              key={symptom.value}
              className="bg-blue-100 text-blue-700 px-3 py-1 text-sm rounded-full flex items-center gap-2"
            >
              {symptom.label}
              <button
                onClick={() => handleRemoveSymptom(symptom.value)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-8">
        <label htmlFor="additionalInfo" className="block text-gray-600 font-medium mb-2">
          Additional Information (Optional):
        </label>
        <textarea
          id="additionalInfo"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Add any other details here..."
          className="w-full p-3 h-36 border border-gray-300 focus:border-gray-400 rounded-lg focus:outline-none focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Submit Button */}
      <div className="mt-5">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 rounded-md bg-blue-600 text-white  transition duration-200"
        >
          Submit Symptoms
        </button>
      </div>
    </div>
  );
};

export default SymptomSelector;
