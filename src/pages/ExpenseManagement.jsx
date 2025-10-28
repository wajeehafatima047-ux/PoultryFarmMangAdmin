import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi2";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { deleteData } from "../Helper/firebaseHelper";
import ExpenseTypeForm from "./ExpenseTypeForm";

function ExpenseManagement() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Real-time listener for expense types
    const typesQuery = query(collection(db, 'expenseTypes'));
    const unsubscribe = onSnapshot(typesQuery, (snapshot) => {
      const typesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTypes(typesData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading expense types:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddType = () => {
    setEditingType(null);
    setShowForm(true);
  };

  const handleEditType = (type) => {
    setEditingType(type.id);
    setShowForm(true);
  };

  const handleDeleteType = async (typeId) => {
    const type = types.find(t => t.id === typeId);
    if (window.confirm(`Are you sure you want to delete "${type?.title}" expense type?`)) {
      try {
        await deleteData('expenseTypes', typeId);
      } catch (error) {
        console.error('Error deleting expense type:', error);
        alert('Failed to delete expense type');
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingType(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingType(null);
  };

  const filteredTypes = types.filter(type => {
    return type.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           type.description?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Expense Management</h3>

      {/* Summary Card */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div
          style={{
            width: 250,
            height: 120,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Total Expense Types</p>
          <h3 style={{ margin: "10px 0", color: "#007bff" }}>{types.length}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>Active Categories</p>
        </div>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          marginBottom: "20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h4 style={{ margin: 0 }}>Expense Types</h4>
            <p style={{ color: "grey", margin: "5px 0 0 0" }}>Manage expense categories and types</p>
          </div>
          <button
            onClick={handleAddType}
            style={{
              backgroundColor: "#007bff",
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
            Add New Type
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
            <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder="Search expense types by title or description..."
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
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading expense types...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Type ID</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Title</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Description</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Created Date</th>
                  <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTypes.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                      {types.length === 0 ? "No expense types found. Create your first expense type!" : "No expense types match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredTypes.map((type) => (
                    <tr key={type.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>
                        <span style={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: "600"
                        }}>
                          {type.typeId}
                        </span>
                      </td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{type.title}</td>
                      <td style={{ padding: "12px", color: "#666" }}>{type.description || '-'}</td>
                      <td style={{ padding: "12px" }}>{type.createdDate || '-'}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleEditType(type)}
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
                            onClick={() => handleDeleteType(type.id)}
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
        <ExpenseTypeForm
          typeId={editingType}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default ExpenseManagement;
