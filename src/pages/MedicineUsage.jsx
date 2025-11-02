import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MedicineUsage() {
  const [usageRecords, setUsageRecords] = useState([]);
  const [medicineInventory, setMedicineInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    animalGroup: "",
    medicineName: "",
    quantityUsed: "",
    unit: "units",
    usageDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadUsageRecords();
    loadMedicineInventory();
  }, []);

  const loadUsageRecords = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "medicineUsage"), orderBy("usageDate", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setUsageRecords(data);
    } catch (error) {
      console.error("Error loading usage records:", error);
      toast.error("Failed to load medicine usage records");
    } finally {
      setLoading(false);
    }
  };

  const loadMedicineInventory = async () => {
    try {
      const { getAllData } = await import("../Helper/firebaseHelper");
      const inventory = await getAllData("medicineInventory");
      setMedicineInventory(inventory);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Find the selected medicine
      const selectedMedicine = medicineInventory.find(
        med => med.medicineName === formData.medicineName
      );

      if (!selectedMedicine) {
        toast.error("Please select a valid medicine");
        return;
      }

      const quantityUsed = parseFloat(formData.quantityUsed);
      const availableStock = selectedMedicine.totalInStock;

      if (quantityUsed > availableStock) {
        toast.error(`Insufficient stock! Available: ${availableStock} ${selectedMedicine.unit}`);
        return;
      }

      const usageData = {
        ...formData,
        quantityUsed: quantityUsed,
        usageDate: Timestamp.fromDate(new Date(formData.usageDate))
      };

      await addDoc(collection(db, "medicineUsage"), usageData);
      
      // Update inventory
      await updateMedicineInventory(selectedMedicine.id, quantityUsed);
      
      toast.success("Medicine usage recorded successfully!");
      setFormData({
        animalGroup: "",
        medicineName: "",
        quantityUsed: "",
        unit: "units",
        usageDate: new Date().toISOString().split('T')[0]
      });
      setShowForm(false);
      loadUsageRecords();
    } catch (error) {
      console.error("Error recording usage:", error);
      toast.error("Failed to record usage");
    }
  };

  const updateMedicineInventory = async (itemId, quantityUsed) => {
    try {
      const { getDataById, updateData } = await import("../Helper/firebaseHelper");
      const item = await getDataById("medicineInventory", itemId);
      
      if (item) {
        const newStock = item.totalInStock - quantityUsed;
        await updateData("medicineInventory", itemId, {
          totalInStock: Math.max(0, newStock),
          lastUpdated: Timestamp.now()
        });
        
        // Show low stock alert
        if (newStock < 10) {
          toast.warning(`Low stock alert: ${item.medicineName} has ${newStock} ${item.unit} remaining`);
        }
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const filteredRecords = usageRecords.filter(record =>
    record.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.animalGroup?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Medicine Usage</h2>
        <button
          onClick={() => setShowForm(!showForm)}
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
          {showForm ? "Cancel" : "Record Usage"}
        </button>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3>Record Medicine Usage</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <select
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              >
                <option value="">Select Medicine</option>
                {medicineInventory.map((med) => (
                  <option key={med.id} value={med.medicineName}>
                    {med.medicineName} ({med.totalInStock} {med.unit})
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Animal Group"
                value={formData.animalGroup}
                onChange={(e) => setFormData({ ...formData, animalGroup: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Quantity Used"
                value={formData.quantityUsed}
                onChange={(e) => setFormData({ ...formData, quantityUsed: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="date"
                value={formData.usageDate}
                onChange={(e) => setFormData({ ...formData, usageDate: e.target.value })}
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
              Save Usage
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by medicine name or animal group..."
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
                <tr style={{ backgroundColor: "#9C27B0", color: "white" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Date</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Medicine Name</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Animal Group</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRecords.map((record) => (
                  <tr key={record.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 12 }}>
                      {record.usageDate?.toDate ? 
                        record.usageDate.toDate().toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: 12 }}>{record.medicineName}</td>
                    <td style={{ padding: 12 }}>{record.animalGroup}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      {record.quantityUsed} {record.unit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No usage records found
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

export default MedicineUsage;
