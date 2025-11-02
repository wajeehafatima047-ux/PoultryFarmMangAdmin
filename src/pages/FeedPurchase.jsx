import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function FeedPurchase() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    vendorId: "",
    itemName: "",
    quantityPurchased: "",
    unit: "kg",
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
      const q = query(collection(db, "feedPurchases"), orderBy("purchaseDate", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setPurchases(data);
    } catch (error) {
      console.error("Error loading purchases:", error);
      toast.error("Failed to load feed purchases");
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
        purchaseDate: Timestamp.fromDate(new Date(formData.purchaseDate))
      };

      await addDoc(collection(db, "feedPurchases"), purchaseData);
      toast.success("Feed purchase recorded successfully!");
      
      // Update inventory
      await updateFeedInventory(formData.itemName, formData.quantityPurchased);
      
      // Create expense
      await createExpense('feedPurchase', purchaseData);
      
      setFormData({
        vendorId: "",
        itemName: "",
        quantityPurchased: "",
        unit: "kg",
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

  const updateFeedInventory = async (itemName, quantity) => {
    try {
      const { getAllData, addData, updateData } = await import("../Helper/firebaseHelper");
      const inventory = await getAllData("feedInventory");
      const existingItem = inventory.find(item => item.itemName === itemName);
      
      if (existingItem) {
        const newQuantity = existingItem.totalInStock + parseFloat(quantity);
        await updateData("feedInventory", existingItem.id, {
          totalInStock: newQuantity,
          lastUpdated: Timestamp.now()
        });
      } else {
        await addData("feedInventory", {
          itemName,
          totalInStock: parseFloat(quantity),
          unit: formData.unit,
          lastUpdated: Timestamp.now()
        });
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const createExpense = async (category, purchaseData) => {
    try {
      const { addData } = await import("../Helper/firebaseHelper");
      await addData("expenses", {
        category: category,
        referenceId: purchaseData.id || `feed_${Date.now()}`,
        description: `Feed Purchase - ${purchaseData.itemName}`,
        amount: purchaseData.totalCost,
        date: Timestamp.now(),
        createdBy: "system"
      });
    } catch (error) {
      console.error("Error creating expense:", error);
    }
  };

  const filteredPurchases = purchases.filter(purchase =>
    purchase.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.vendorId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedPurchases = filteredPurchases.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPurchases.length / itemsPerPage);

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Feed Purchase</h2>
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

      {showForm && (
        <div style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3>Record Feed Purchase</h3>
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
                placeholder="Item Name"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
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
                <option value="kg">kg</option>
                <option value="bags">bags</option>
                <option value="tons">tons</option>
              </select>
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
          placeholder="Search by item name, vendor, or invoice..."
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
                  <th style={{ padding: 12, textAlign: "left" }}>Date</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Item Name</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Vendor ID</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Quantity</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Price/Unit</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Total Cost</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Invoice ID</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPurchases.map((purchase) => (
                  <tr key={purchase.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 12 }}>
                      {purchase.purchaseDate?.toDate ? 
                        purchase.purchaseDate.toDate().toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: 12 }}>{purchase.itemName}</td>
                    <td style={{ padding: 12 }}>{purchase.vendorId}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      {purchase.quantityPurchased} {purchase.unit}
                    </td>
                    <td style={{ padding: 12, textAlign: "right" }}>
                      ${purchase.pricePerUnit?.toFixed(2)}
                    </td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                      ${purchase.totalCost?.toFixed(2)}
                    </td>
                    <td style={{ padding: 12 }}>{purchase.invoiceId || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredPurchases.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No feed purchases found
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

export default FeedPurchase;
