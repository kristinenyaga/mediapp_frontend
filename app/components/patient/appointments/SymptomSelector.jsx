import React from 'react';
import Select from 'react-select'; 

const SymptomSelector = ({ symptoms, selectedSymptoms, setSelectedSymptoms, additionalInfo, setAdditionalInfo }) => {
  
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


  // Filter out already selected symptoms from the dropdown
  const filteredOptions = symptomOptions.filter(
    (option) => !selectedSymptoms?.some((symptom) => symptom.value === option.value)
  );
  return (
    <div className="mt-8 max-w-[90%]">
      <h2 className="mb-4 text-secondary font-medium">Select Symptoms <span className='text-sm text-gray-600'>(optional)</span></h2>

      <Select
        options={filteredOptions}
        onChange={(selectedOption) => {
          handleAddSymptom(selectedOption);
        }}
        placeholder="Search and select symptoms..."
        className="mb-4 focus:outline-none placeholder:text-sm"
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
        <h3 className=" mb-2">Selected Symptoms:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedSymptoms?.map((symptom) => (
            <span
              key={symptom.value}
              className="bg-[#6c4de612] text-secondary px-3 py-1 text-sm rounded-full flex items-center gap-2"
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
        <label htmlFor="additionalInfo" className="block  mb-2">
          Additional Information <span className='text-sm text-gray-600'>(optional)</span>
        </label>
        <textarea
          id="additionalInfo"
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          placeholder="Add any other details here..."
          className="w-full p-3 h-36 border border-gray-300 focus:border-gray-400 rounded-lg focus:outline-none focus:ring-blue-500"
        ></textarea>
      </div>

    </div>
  );
};

export default SymptomSelector;
