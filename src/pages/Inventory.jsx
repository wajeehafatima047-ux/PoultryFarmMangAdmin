import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi";
import { HiTemplate } from "react-icons/hi";
import { CgDanger } from "react-icons/cg";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { getAllData, addData, updateData, deleteData } from "../Helper/firebaseHelper";

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    supplier: "",
    lastReStock: "",
    status: "In Stock"
  });

  // Load inventory from Firestore
  const loadInventory = async () => {
    try {
      setLoading(true);
      const inventoryData = await getAllData("inventory");
      setInventory(inventoryData || []);
    } catch (error) {
      console.error("Error loading inventory:", error);
      alert("Error loading inventory. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Filter inventory based on search and category
  useEffect(() => {
    let filtered = inventory;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(item =>
        (item.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.supplier || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "All") {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    setFilteredInventory(filtered);
  }, [searchTerm, categoryFilter, inventory]);

  // Load inventory on component mount
  useEffect(() => {
    loadInventory();
  }, []);

  // Calculate statistics
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => item.status === "Low Stock").length;
  const categories = [...new Set(inventory.map(item => item.category))].length;

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle add new item
  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      name: "",
      category: "",
      quantity: "",
      supplier: "",
      lastReStock: "",
      status: "In Stock"
    });
    setShowForm(true);
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item.id);
    setFormData({
      name: item.name || "",
      category: item.category || "",
      quantity: item.quantity || "",
      supplier: item.supplier || "",
      lastReStock: item.lastReStock || "",
      status: item.status || "In Stock"
    });
    setShowForm(true);
  };

  // Handle delete item
  const handleDeleteItem = async (itemId) => {
    const item = inventory.find(inv => inv.id === itemId);
    if (window.confirm(`Are you sure you want to delete ${item?.name}?`)) {
      try {
        setLoading(true);
        await deleteData("inventory", itemId);
        loadInventory();
      } catch (error) {
        console.error("Error deleting item:", error);
        alert("Error deleting item. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.category || !formData.quantity || !formData.supplier || !formData.lastReStock) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      if (editingItem) {
        // Update existing item
        await updateData("inventory", editingItem, formData);
      } else {
        // Add new item
        await addData("inventory", {
          ...formData,
          createdAt: new Date().toISOString()
        });
      }
      loadInventory();
      setShowForm(false);
      setFormData({
        name: "",
        category: "",
        quantity: "",
        supplier: "",
        lastReStock: "",
        status: "In Stock"
      });
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Error saving item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock": return "#4caf50";
      case "Low Stock": return "#ff9800";
      case "Out of Stock": return "#f44336";
      default: return "#666";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Inventory Management</h3>

      {/* Statistics Cards */}
      <span style={{ display: "flex" }}>
        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
            padding: "15px"
          }}
        >
          <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <HiTemplate />
            <h4 style={{ margin: 0 }}>Total Items</h4>
          </span>
          <h3 style={{ margin: "10px 0" }}>{totalItems}</h3>
          <p style={{ color: "grey", margin: 0 }}>Across {categories} categories</p>
        </div>

        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
            padding: "15px"
          }}
        >
          <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <CgDanger />
            <h4 style={{ margin: 0 }}>Low Stock Items</h4>
          </span>
          <h3 style={{ margin: "10px 0" }}>{lowStockItems}</h3>
          <p style={{ color: "grey", margin: 0 }}>Items need Restock</p>
        </div>

        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
            padding: "15px"
          }}
        >
          <span style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>Recent Activity</h4>
          </span>
          <h3 style={{ margin: "10px 0" }}>{totalItems}</h3>
          <p style={{ color: "grey", margin: 0 }}>In the past 30 days</p>
        </div>
      </span>

      {/* Main Content */}
      <div
        style={{
          width: "1000px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          marginTop: "20px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div>
            <h4 style={{ margin: 0 }}>Inventory Items</h4>
            <p style={{ color: "grey", margin: "5px 0 0 0" }}>
              Manage your inventory items and stock levels
            </p>
          </div>
          <button
            onClick={handleAddItem}
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
            Add New Item
          </button>
        </div>

        {/* Search and Filter */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
            <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder="Search inventory items..."
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

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              height: "40px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              padding: "0 10px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="All">All Categories</option>
            <option value="Feed">Feed</option>
            <option value="Medicine">Medicine</option>
            <option value="Eggs">Eggs</option>
            <option value="Equipment">Equipment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Inventory Table */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            Loading inventory...
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "white",
              borderRadius: "10px",
              overflow: "hidden"
            }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Name</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Category</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Quantity</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Supplier</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Last Restocked</th>
                  <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                  <th style={{ padding: "15px", textAlign: "center", borderBottom: "1px solid #ddd" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                      {inventory.length === 0 ? "No inventory items found. Add your first item!" : "No items match your search."}
                    </td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "15px" }}>
                        <strong>{item.name}</strong>
                      </td>
                      <td style={{ padding: "15px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2"
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: "15px" }}>{item.quantity}</td>
                      <td style={{ padding: "15px" }}>{item.supplier}</td>
                      <td style={{ padding: "15px" }}>{formatDate(item.lastReStock)}</td>
                      <td style={{ padding: "15px" }}>
                        <span style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          backgroundColor: getStatusColor(item.status),
                          color: "white"
                        }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ padding: "15px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleEditItem(item)}
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
                            onClick={() => handleDeleteItem(item.id)}
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

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "10px",
            padding: "30px",
            width: "500px",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <h3 style={{ marginTop: 0 }}>{editingItem ? "Edit Item" : "Add New Item"}</h3>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Feed">Feed</option>
                  <option value="Medicine">Medicine</option>
                  <option value="Eggs">Eggs</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Quantity *
                </label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="e.g., 450 kg, 100 bottles"
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Supplier *
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Last Restocked *
                </label>
                <input
                  type="date"
                  name="lastReStock"
                  value={formData.lastReStock}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "500" }}>
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                    fontSize: "14px"
                  }}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "14px"
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    padding: "10px 20px",
                    borderRadius: "5px",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontSize: "14px",
                    opacity: loading ? 0.6 : 1
                  }}
                >
                  {loading ? "Saving..." : (editingItem ? "Update" : "Add Item")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
