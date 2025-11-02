import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function MedicinePurchase() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    vendorId: "",
    medicineName: "",
    quantityPurchased: "",
    unit: "units",
    expiryDate: "",
    pricePerUnit: "",
    totalCost: 0,
    purchaseDate: new Date().toISOString().split('T')[0],
    invoiceId: ""
  });

  useEffect(() => {
    loadPurchases();
  }, []);

  useEffect(() => {
    const qty = parseFloat(formData.quantityPurchased) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    setFormData(prev => ({ ...prev, totalCost: (qty * price).toFixed(2) }));
  }, [formData.quantityPurchased, formData.pricePerUnit]);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "medicinePurchases"), orderBy("purchaseDate", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPurchases(data);
    } catch (error) {
      console.error("Error loading purchases:", error);
      toast.error("Failed to load medicine purchases");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const purchaseData = {
        ...formData,
        quantityPurchased: parseFloat(formData.quantityPurchased),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalCost: parseFloat(formData.totalCost),
        purchaseDate: Timestamp.fromDate(new Date(formData.purchaseDate)),
        expiryDate: Timestamp.fromDate(new Date(formData.expiryDate))
      };

      await addDoc(collection(db, "medicinePurchases"), purchaseData);
      toast.success("Medicine purchase recorded successfully!");
      
      // Update inventory
      await updateMedicineInventory(formData.medicineName, formData.quantityPurchased, formData.expiryDate);
      
      setFormData({
        vendorId: "",
        medicineName: "",
        quantityPurchased: "",
        unit: "units",
        expiryDate: "",
        pricePerUnit: "",
        totalCost: 0,
        purchaseDate: new Date().toISOString().split('T')[0],
        invoiceId: ""
      });
      setShowForm(false);
      loadPurchases();
    } catch (error) {
      console.error("Error adding purchase:", error);
      toast.error("Failed to record purchase");
    }
  };

  const updateMedicineInventory = async (medicineName, quantity, expiryDate) => {
    try {
      const { getAllData, addData, updateData } = await import("../Helper/firebaseHelper");
      const inventory = await getAllData("medicineInventory");
      const existingItem = inventory.find(item => item.medicineName === medicineName);
      
      if (existingItem) {
        const newQuantity = existingItem.totalInStock + parseFloat(quantity);
        await updateData("medicineInventory", existingItem.id, {
          totalInStock: newQuantity,
          expiryDate: Timestamp.fromDate(new Date(expiryDate)),
          lastUpdated: Timestamp.now()
        });
      } else {
        await addData("medicineInventory", {
          medicineName,
          totalInStock: parseFloat(quantity),
          unit: formData.unit,
          expiryDate: Timestamp.fromDate(new Date(expiryDate)),
          lastUpdated: Timestamp.now()
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.medicineName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.vendorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  // Check for expiring medicines
  const expiringSoon = purchases.filter(purchase => {
    if (!purchase.expiryDate?.toDate) return false;
    const expiryDate = purchase.expiryDate.toDate();
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  });

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Medicine Purchase</h2>
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
          {showForm ? "Cancel" : "Add Purchase"}
        </button>
      </div>

      {expiringSoon.length > 0 && (
        <div style={{
          backgroundColor: "#fff3cd",
          border: "1px solid #ffc107",
          borderRadius: 5,
          padding: 15,
          marginBottom: 20
        }}>
          <h3 style={{ color: "#856404", marginTop: 0 }}>⚠️ Expiring Soon</h3>
          <p style={{ color: "#856404", margin: 0 }}>
            {expiringSoon.length} medicine(s) expiring within 30 days
          </p>
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
          <h3>Record Medicine Purchase</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <input
                type="text"
                placeholder="Vendor ID"
                value={formData.vendorId}
                onChange={(e) => setFormData({ ...formData, vendorId: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Medicine Name"
                value={formData.medicineName}
                onChange={(e) => setFormData({ ...formData, medicineName: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Quantity Purchased"
                value={formData.quantityPurchased}
                onChange={(e) => setFormData({ ...formData, quantityPurchased: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              >
                <option value="units">units</option>
                <option value="boxes">boxes</option>
                <option value="bottles">bottles</option>
                <option value="packs">packs</option>
              </select>
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price Per Unit"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Invoice ID (Optional)"
                value={formData.invoiceId}
                onChange={(e) => setFormData({ ...formData, invoiceId: e.target.value })}
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Total Cost"
                value={formData.totalCost}
                readOnly
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd", backgroundColor: "#e9e9e9" }}
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
              Save Purchase
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by medicine name, vendor, or invoice..."
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
                  <th style={{ padding: 12, textAlign: "left" }}>Vendor ID</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Quantity</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Expiry Date</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Price/Unit</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Total Cost</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Invoice ID</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPurchases.map((purchase) => {
                  const expiryDate = purchase.expiryDate?.toDate ? purchase.expiryDate.toDate() : null;
                  const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24)) : null;
                  
                  return (
                    <tr key={purchase.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: 12 }}>
                        {purchase.purchaseDate?.toDate ? 
                          purchase.purchaseDate.toDate().toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: 12 }}>{purchase.medicineName}</td>
                      <td style={{ padding: 12 }}>{purchase.vendorId}</td>
                      <td style={{ padding: 12, textAlign: "right" }}>
                        {purchase.quantityPurchased} {purchase.unit}
                      </td>
                      <td style={{ 
                        padding: 12,
                        color: daysUntilExpiry !== null && daysUntilExpiry <= 30 ? "red" : "inherit",
                        fontWeight: daysUntilExpiry !== null && daysUntilExpiry <= 30 ? "bold" : "normal"
                      }}>
                        {expiryDate ? expiryDate.toLocaleDateString() : "N/A"}
                        {daysUntilExpiry !== null && daysUntilExpiry <= 30 && " ⚠️"}
                      </td>
                      <td style={{ padding: 12, textAlign: "right" }}>
                        ${purchase.pricePerUnit?.toFixed(2)}
                      </td>
                      <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                        ${purchase.totalCost?.toFixed(2)}
                      </td>
                      <td style={{ padding: 12 }}>{purchase.invoiceId || "N/A"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredPurchases.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No medicine purchases found
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

export default MedicinePurchase;
