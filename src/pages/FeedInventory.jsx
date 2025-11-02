import React, { useState, useEffect } from "react";
import { getAllData, updateData, deleteData, addData } from "../Helper/firebaseHelper";
import { Timestamp } from "firebase/firestore";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FeedInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    itemName: "",
    totalInStock: "",
    unit: "kg"
  });

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getAllData("feedInventory");
      setInventory(data || []);
    } catch (error) {
      console.error("Error loading inventory:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingItem) {
        await updateData("feedInventory", editingItem.id, {
          ...formData,
          totalInStock: parseFloat(formData.totalInStock),
          lastUpdated: Timestamp.now()
        });
        toast.success("Inventory item updated successfully!");
      } else {
        await addData("feedInventory", {
          ...formData,
          totalInStock: parseFloat(formData.totalInStock),
          lastUpdated: Timestamp.now()
        });
        toast.success("Inventory item added successfully!");
      }
      
      setFormData({ itemName: "", totalInStock: "", unit: "kg" });
      setEditingItem(null);
      setShowForm(false);
      loadInventory();
    } catch (error) {
      console.error("Error saving inventory:", error);
      toast.error("Failed to save inventory item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      itemName: item.itemName,
      totalInStock: item.totalInStock,
      unit: item.unit
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    
    try {
      await deleteData("feedInventory", id);
      toast.success("Item deleted successfully!");
      loadInventory();
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const filteredInventory = inventory.filter(item =>
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  const lowStockItems = inventory.filter(item => item.totalInStock < 100);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Feed Inventory</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            if (!showForm) {
              setEditingItem(null);
              setFormData({ itemName: "", totalInStock: "", unit: "kg" });
            }
          }}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 16
          }}
        >
          {showForm ? "Cancel" : "Add Item"}
        </button>
      </div>

      {lowStockItems.length > 0 && (
        <div style={{
          backgroundColor: "#ffebee",
          border: "1px solid #ffcdd2",
          borderRadius: 5,
          padding: 15,
          marginBottom: 20
        }}>
          <h3 style={{ color: "#c62828", marginTop: 0 }}>⚠️ Low Stock Alert</h3>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {lowStockItems.map(item => (
              <li key={item.id} style={{ color: "#c62828" }}>
                {item.itemName}: {item.totalInStock} {item.unit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {showForm && (
        <div style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3>{editingItem ? "Edit" : "Add"} Inventory Item</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <input
                type="text"
                placeholder="Item Name"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              >
                <option value="kg">kg</option>
                <option value="bags">bags</option>
                <option value="tons">tons</option>
              </select>
              <input
                type="number"
                step="0.01"
                placeholder="Total In Stock"
                value={formData.totalInStock}
                onChange={(e) => setFormData({ ...formData, totalInStock: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 30px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: 5,
                cursor: "pointer",
                marginTop: 15,
                fontSize: 16
              }}
            >
              {editingItem ? "Update" : "Add"} Item
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by item name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            maxWidth: 400,
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ddd"
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
              <thead>
                <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Item Name</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Total In Stock</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Last Updated</th>
                  <th style={{ padding: 12, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory.map((item) => (
                  <tr 
                    key={item.id} 
                    style={{ borderBottom: "1px solid #ddd" }}
                  >
                    <td style={{ padding: 12 }}>{item.itemName}</td>
                    <td style={{ 
                      padding: 12, 
                      textAlign: "right",
                      color: item.totalInStock < 100 ? "red" : "inherit",
                      fontWeight: item.totalInStock < 100 ? "bold" : "normal"
                    }}>
                      {item.totalInStock} {item.unit}
                      {item.totalInStock < 100 && " ⚠️"}
                    </td>
                    <td style={{ padding: 12 }}>
                      {item.lastUpdated?.toDate ? 
                        item.lastUpdated.toDate().toLocaleString() : "N/A"}
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      <button
                        onClick={() => handleEdit(item)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer",
                          marginRight: 5
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          borderRadius: 3,
                          cursor: "pointer"
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No inventory items found
            </div>
          )}

          {totalPages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 20, gap: 10 }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentPage === 1 ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: currentPage === 1 ? "not-allowed" : "pointer"
                }}
              >
                Previous
              </button>
              <span style={{ padding: 8 }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 15px",
                  backgroundColor: currentPage === totalPages ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: 5,
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer"
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default FeedInventory;
