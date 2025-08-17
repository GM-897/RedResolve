// src/components/AddComplaintButton.js

import React from 'react';

// This is now a simpler component. It just calls the function it receives.
const AddComplaintButton = ({ onButtonClick }) => {
  return (
    <div className="add-complaint-container">
      <button className="add-complaint-btn" onClick={onButtonClick}>
        Add a Complaint
      </button>
    </div>
  );
};

export default AddComplaintButton;