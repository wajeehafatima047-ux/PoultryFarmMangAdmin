import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { GiRoastChicken } from "react-icons/gi";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { deleteData } from "../Helper/firebaseHelper";
import PurchaseChickenForm from "./PurchaseChickenForm";

function PurchaseChicken() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    // Real-time listener for chicken purchases
    const purchasesQuery = query(collection(db, 'chickenPurchases'));
    const unsubscribe = onSnapshot(purchasesQuery, (snapshot) => {
      const purchasesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPurchases(purchasesData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading purchases:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPurchase = () => {
    setEditingPurchase(null);
    setShowForm(true);
  };

  const handleEditPurchase = (purchase) => {
    setEditingPurchase(purchase.id);
    setShowForm(true);
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (window.confirm('Are you sure you want to delete this purchase?')) {
      try {
        await deleteData('chickenPurchases', purchaseId);
      } catch (error) {
        console.error('Error deleting purchase:', error);
        alert('Failed to delete purchase');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPurchase(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPurchase(null);
  };

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.purchaseId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !dateFilter || purchase.purchaseDate === dateFilter;
    
    return matchesSearch && matchesDate;
  });

  // Calculate summary statistics
  const totalPurchases = purchases.reduce((sum, purchase) => sum + (parseFloat(purchase.totalCost) || 0), 0);
  const totalQuantity = purchases.reduce((sum, purchase) => sum + (parseInt(purchase.quantity) || 0), 0);
  const averagePrice = totalQuantity > 0 ? totalPurchases / totalQuantity : 0;

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontSize: "24px", color: "#ff9800" }}>
          <GiRoastChicken />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Chicken Purchase Management</h3>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Total Purchases</p>
          <h3 style={{ margin: "10px 0", color: "#ff9800" }}>{formatCurrency(totalPurchases)}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>From {purchases.length} Transactions</p>
        </div>

        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Total Chickens</p>
          <h3 style={{ margin: "10px 0", color: "#4caf50" }}>{totalQuantity}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>Purchased</p>
        </div>

        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Average Price</p>
          <h3 style={{ margin: "10px 0", color: "#2196f3" }}>{formatCurrency(averagePrice)}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>Per Chicken</p>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h4 style={{ margin: 0 }}>Purchase Records</h4>
            <p style={{ color: "grey", margin: "5px 0 0 0" }}>Track all chicken purchases</p>
          </div>
          <button
            onClick={handleAddPurchase}
            style={{
              backgroundColor: "#ff9800",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px"
            }}
          >
            <FiPlus size={16} />
            Add New Purchase
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
            <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder="Search by supplier or purchase ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                height: "40px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                paddingLeft: "35px",
                fontSize: "14px"
              }}
            />
          </div>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            style={{
              height: "40px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              padding: "0 10px",
              fontSize: "14px"
            }}
          />
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading purchases...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Purchase ID</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Supplier</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Quantity</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Price/Chicken</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Age</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Total Cost</th>
                  <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                      {purchases.length === 0 ? "No purchases found. Create your first purchase!" : "No purchases match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredPurchases.map((purchase) => (
                    <tr key={purchase.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{purchase.purchaseId}</td>
                      <td style={{ padding: "12px" }}>{purchase.purchaseDate}</td>
                      <td style={{ padding: "12px" }}>{purchase.supplier}</td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{purchase.quantity}</td>
                      <td style={{ padding: "12px" }}>{formatCurrency(purchase.pricePerChicken || 0)}</td>
                      <td style={{ padding: "12px" }}>{purchase.ageAtPurchase} {purchase.ageUnit || 'days'}</td>
                      <td style={{ padding: "12px", fontWeight: "500", color: "#ff9800" }}>{formatCurrency(purchase.totalCost || 0)}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleEditPurchase(purchase)}
                            style={{
                              backgroundColor: "#007bff",
                              color: "white",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px"
                            }}
                          >
                            <FiEdit size={12} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePurchase(purchase.id)}
                            style={{
                              backgroundColor: "#dc3545",
                              color: "white",
                              border: "none",
                              padding: "6px 10px",
                              borderRadius: "4px",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              fontSize: "12px"
                            }}
                          >
                            <FiTrash2 size={12} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showForm && (
        <PurchaseChickenForm
          purchaseId={editingPurchase}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default PurchaseChicken;
