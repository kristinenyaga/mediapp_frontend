import React from 'react';
import Loader from './Loader';

const FullPageLoader = () => {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-gray-100 flex items-center justify-center z-50">
      <Loader size="12" color="blue-600" />
    </div>
  );
};

export default FullPageLoader;
