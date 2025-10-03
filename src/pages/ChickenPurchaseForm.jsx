import React, { useState } from 'react';

function ChickenPurchaseForm() {
  const [formData, setFormData] = useState({
    purchaseDate: '',
    supplierName: '',
    quantity: '',
    purchasePerChicken: '',
  });

  // Calculate total cost
  const totalCost = (formData.quantity && formData.purchasePerChicken)
    ? formData.quantity * formData.purchasePerChicken
    : 0;

  // Handle input change


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // {
  //      purchaseDate: '',
  //   supplierName: '',
  //   quantity: '10',
  //   purchasePerChicken: '',
  //   supplierName : 'xyz'


  // }

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Purchase submitted:', { ...formData, totalCost });
    alert('Purchase submitted! Check console for details.');

    // Clear form
    setFormData({
      purchaseDate: '',
      supplierName: '',
      quantity: '',
      purchasePerChicken: '',
    });
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh', padding: '30px', fontFamily: 'Arial' }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        maxWidth: '400px',
        margin: '0 auto',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Purchase Form</h2>

        <form onSubmit={handleSubmit}>
          {/* Purchase Date */}
          <label style={labelStyle}>Purchase Date</label>
          <input
            type="date"
            name="purchaseDate"
            value={formData.purchaseDate}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Supplier Name */}
          <label style={labelStyle}>Supplier Name</label>
          <input
            type="text"
            name="supplierName"
            value={formData.supplierName}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Quantity */}
          <label style={labelStyle}>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Purchase Per Chicken */}
          <label style={labelStyle}>Purchase Per Chicken</label>
          <input
            type="number"
            name="purchasePerChicken"
            value={formData.purchasePerChicken}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {/* Total Cost (Read-only) */}
          <label style={labelStyle}>Total Cost</label>
          <input
            type="number"
            value={totalCost}
            readOnly
            style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
          />

          {/* Submit */}
          <button type="submit" style={buttonStyle}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// 🔹 Styles
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

export default ChickenPurchaseForm;





