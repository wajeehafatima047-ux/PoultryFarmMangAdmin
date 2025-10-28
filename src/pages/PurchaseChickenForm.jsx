import React, { useState, useEffect } from 'react';
import { addData, updateData, getDataById } from '../Helper/firebaseHelper';

const PurchaseChickenForm = ({ purchaseId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    purchaseId: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    supplier: '',
    quantity: '',
    pricePerChicken: '',
    totalCost: 0,
    ageAtPurchase: '',
    ageUnit: 'days',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const ageUnitOptions = ['days', 'weeks', 'months'];

  useEffect(() => {
    if (purchaseId) {
      loadPurchaseData();
    } else {
      // Generate new purchase ID
      const newPurchaseId = `PUR-${Date.now().toString().slice(-6)}`;
      setFormData(prev => ({ ...prev, purchaseId: newPurchaseId }));
    }
  }, [purchaseId]);

  // Calculate total cost whenever quantity or price changes
  useEffect(() => {
    const quantity = parseFloat(formData.quantity) || 0;
    const pricePerChicken = parseFloat(formData.pricePerChicken) || 0;
    const totalCost = quantity * pricePerChicken;
    
    setFormData(prev => ({ ...prev, totalCost }));
  }, [formData.quantity, formData.pricePerChicken]);

  const loadPurchaseData = async () => {
    try {
      setLoading(true);
      const purchaseData = await getDataById('chickenPurchases', purchaseId);
      if (purchaseData) {
        setFormData({
          purchaseId: purchaseData.purchaseId || '',
          purchaseDate: purchaseData.purchaseDate || new Date().toISOString().split('T')[0],
          supplier: purchaseData.supplier || '',
          quantity: purchaseData.quantity || '',
          pricePerChicken: purchaseData.pricePerChicken || '',
          totalCost: purchaseData.totalCost || 0,
          ageAtPurchase: purchaseData.ageAtPurchase || '',
          ageUnit: purchaseData.ageUnit || 'days',
          notes: purchaseData.notes || ''
        });
      }
    } catch (error) {
      setError('Failed to load purchase data');
      console.error('Error loading purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const purchaseData = {
        ...formData,
        quantity: parseInt(formData.quantity) || 0,
        pricePerChicken: parseFloat(formData.pricePerChicken) || 0,
        totalCost: parseFloat(formData.totalCost) || 0,
        ageAtPurchase: parseInt(formData.ageAtPurchase) || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (purchaseId) {
        await updateData('chickenPurchases', purchaseId, purchaseData);
        alert('Purchase updated successfully!');
      } else {
        await addData('chickenPurchases', purchaseData);
        alert('Purchase added successfully!');
      }

      onSuccess();
    } catch (error) {
      setError('Failed to save purchase. Please try again.');
      console.error('Error saving purchase:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "10px",
        padding: "30px",
        width: "90%",
        maxWidth: "600px",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ margin: 0 }}>{purchaseId ? 'Edit Purchase' : 'Add New Purchase'}</h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#666"
            }}
          >
            ×
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: "#ffebee",
            color: "#c62828",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Purchase ID */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Purchase ID</label>
            <input
              type="text"
              name="purchaseId"
              value={formData.purchaseId}
              readOnly
              style={{ ...inputStyle, backgroundColor: "#f5f5f5" }}
            />
          </div>

          {/* Purchase Date */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Purchase Date *</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate}
              onChange={handleInputChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Supplier */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Supplier Name *</label>
            <input
              type="text"
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              placeholder="Enter supplier name"
              required
              style={inputStyle}
            />
          </div>

          {/* Quantity */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Quantity (Number of Chickens) *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="Enter quantity"
              min="1"
              required
              style={inputStyle}
            />
          </div>

          {/* Price Per Chicken */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Price Per Chicken (PKR) *</label>
            <input
              type="number"
              name="pricePerChicken"
              value={formData.pricePerChicken}
              onChange={handleInputChange}
              placeholder="Enter price per chicken"
              step="0.01"
              min="0"
              required
              style={inputStyle}
            />
          </div>

          {/* Total Cost (Auto-calculated) */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Total Cost (PKR)</label>
            <input
              type="number"
              name="totalCost"
              value={formData.totalCost.toFixed(2)}
              readOnly
              style={{ ...inputStyle, backgroundColor: "#f5f5f5", fontWeight: "bold", color: "#ff9800" }}
            />
          </div>

          {/* Age at Purchase */}
          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Age at Purchase *</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                type="number"
                name="ageAtPurchase"
                value={formData.ageAtPurchase}
                onChange={handleInputChange}
                placeholder="Enter age"
                min="0"
                required
                style={{ ...inputStyle, flex: 2, marginBottom: 0 }}
              />
              <select
                name="ageUnit"
                value={formData.ageUnit}
                onChange={handleInputChange}
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
              >
                {ageUnitOptions.map(unit => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Notes */}
          <div style={{ marginBottom: "20px" }}>
            <label style={labelStyle}>Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes"
              rows="3"
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                backgroundColor: "white",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                backgroundColor: loading ? "#ccc" : "#ff9800",
                color: "white",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500"
              }}
            >
              {loading ? 'Saving...' : (purchaseId ? 'Update Purchase' : 'Add Purchase')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Styles
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ddd",
  fontSize: "14px",
  boxSizing: "border-box"
};

const labelStyle = {
  display: "block",
  marginBottom: "5px",
  fontWeight: "500",
  fontSize: "14px",
  color: "#333"
};

export default PurchaseChickenForm;
