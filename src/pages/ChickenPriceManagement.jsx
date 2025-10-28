import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import { HiOutlineCube } from "react-icons/hi";

function ChickenPriceManagement() {
  const [currentPrice, setCurrentPrice] = useState('');
  const [priceHistory, setPriceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPrice, setEditingPrice] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    // Real-time listener for chicken prices
    const pricesQuery = query(
      collection(db, 'chickenPrices'),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(pricesQuery, (snapshot) => {
      const prices = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      }));
      
      setPriceHistory(prices);
      
      // Set the most recent price as current
      if (prices.length > 0) {
        setCurrentPrice(prices[0].pricePerKg);
      }
      
      setLoading(false);
    }, (error) => {
      console.error('Error fetching chicken prices:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Handle adding new price
  const handleAddPrice = async (e) => {
    e.preventDefault();
    
    if (!currentPrice || parseFloat(currentPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      await addDoc(collection(db, 'chickenPrices'), {
        pricePerKg: parseFloat(currentPrice),
        date: new Date().toISOString(),
        updatedBy: 'Admin' // You can replace this with actual user info
      });

      alert('Price added successfully!');
      setCurrentPrice('');
    } catch (error) {
      console.error('Error adding price:', error);
      alert('Failed to add price. Please try again.');
    }
  };

  // Handle editing existing price
  const handleEditPrice = async (priceId) => {
    if (!newPrice || parseFloat(newPrice) <= 0) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const priceRef = doc(db, 'chickenPrices', priceId);
      await updateDoc(priceRef, {
        pricePerKg: parseFloat(newPrice),
        lastModified: new Date().toISOString(),
        updatedBy: 'Admin'
      });

      alert('Price updated successfully!');
      setEditingPrice(null);
      setNewPrice('');
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update price. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: '20px' }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Today's Chicken Price Management</h3>
      <p style={{ color: 'grey', marginBottom: '30px' }}>Set and manage the daily price per kg of chicken</p>

      {/* Current Price Display */}
      {priceHistory.length > 0 && (
        <div
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '30px',
            maxWidth: '400px'
          }}
        >
          <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Current Price per Kg</p>
          <h1 style={{ margin: '0 0 10px 0' }}>{formatCurrency(priceHistory[0].pricePerKg)}</h1>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
            Last updated: {formatDate(priceHistory[0].date)}
          </p>
        </div>
      )}

      {/* Add New Price Form */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          maxWidth: '400px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}
      >
        <h4 style={{ marginTop: 0 }}>Set New Price</h4>
        <form onSubmit={handleAddPrice}>
          <label style={labelStyle}>Price per Kg (PKR)</label>
          <input
            type="number"
            step="0.01"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            placeholder="Enter price per kg in PKR"
            required
            style={inputStyle}
          />

          <button type="submit" style={buttonStyle}>
            Set Price
          </button>
        </form>
      </div>

      {/* Price History */}
      <div>
        <h4>Price History</h4>
        {loading ? (
          <p style={{ color: 'grey' }}>Loading price history...</p>
        ) : priceHistory.length === 0 ? (
          <p style={{ color: 'grey' }}>No price history available. Add a new price above.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Price per Kg</th>
                  <th style={thStyle}>Updated By</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory.map((price) => (
                  <tr key={price.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={tdStyle}>{formatDate(price.date)}</td>
                    <td style={tdStyle}>
                      {editingPrice === price.id ? (
                        <input
                          type="number"
                          step="0.01"
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          style={{ ...inputStyle, marginBottom: 0, width: '120px' }}
                        />
                      ) : (
                        <strong>{formatCurrency(price.pricePerKg)}</strong>
                      )}
                    </td>
                    <td style={tdStyle}>{price.updatedBy || 'Admin'}</td>
                    <td style={tdStyle}>
                      {editingPrice === price.id ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => handleEditPrice(price.id)}
                            style={{ ...editButtonStyle, backgroundColor: '#4CAF50' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingPrice(null);
                              setNewPrice('');
                            }}
                            style={{ ...editButtonStyle, backgroundColor: '#f44336' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingPrice(price.id);
                            setNewPrice(price.pricePerKg);
                          }}
                          style={editButtonStyle}
                        >
                          Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  width: '100%',
  padding: '10px',
  marginTop: '5px',
  marginBottom: '15px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  fontSize: '14px'
};

const labelStyle = {
  fontWeight: 'bold',
  display: 'block',
  marginBottom: '5px'
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 'bold'
};

const editButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#2196F3',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  backgroundColor: 'white',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)',
  borderRadius: '8px',
  overflow: 'hidden'
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold'
};

const tdStyle = {
  padding: '12px'
};

export default ChickenPriceManagement;
