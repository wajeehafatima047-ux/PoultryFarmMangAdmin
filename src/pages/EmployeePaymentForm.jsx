import React, { useState } from 'react';

function EmployeePaymentForm() {
  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    amount: '',
    paymentDate: '',
  });

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('Payment Submitted:', formData);
    alert('Payment submitted! Check console for details.');

    // Clear the form
    setFormData({
      employeeId: '',
      amount: '',
      paymentDate: '',
    });
  };

  return (
    <div style={{
      backgroundColor: '#f0f0f0',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Arial',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Employee Payment Form</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Employee ID */}
          <label style={labelStyle}>Employee ID</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Amount */}
          <label style={labelStyle}>Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Payment Date */}
          <label style={labelStyle}>Payment Date</label>
          <input
            type="date"
            name="paymentDate"
            value={formData.paymentDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Submit Button */}
          <button type="submit" style={buttonStyle}>
            Submit Payment
          </button>
        </form>
      </div>
    </div>
  );
}

// 🔹 Inline style objects
const inputStyle = {
  width: '100%',
  padding: '8px',
  marginTop: '5px',
  marginBottom: '15px',
  borderRadius: '4px',
  border: '1px solid #ccc'
};

const labelStyle = {
  fontWeight: 'bold'
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};




export default EmployeePaymentForm;
