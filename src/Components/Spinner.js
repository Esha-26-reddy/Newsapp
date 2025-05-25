// Spinner.js
import React from 'react';
import loading from './loading.gif'; // Ensure this path is correct

const Spinner = () => {
  return (
    <div className="text-center my-2">
      <img src={loading} alt="loading" style={{ width: '30px', height: '30px' }} />
    </div>
  );
};

export default Spinner;
