import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function DailyChickenRate() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    breed: "",
    pricePerUnit: ""
  });

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "dailyChickenRate"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setRates(data);
    } catch (error) {
      console.error("Error loading rates:", error);
      toast.error("Failed to load chicken rates");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const rateData = {
        ...formData,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        date: Timestamp.fromDate(new Date(formData.date))
      };

      // Check if rate already exists for this date and breed
      const existingRate = rates.find(r => {
        const rateDate = r.date?.toDate ? r.date.toDate().toISOString().split('T')[0] : null;
        return rateDate === formData.date && r.breed === formData.breed;
      });

      if (existingRate) {
        toast.error("Rate already exists for this date and breed");
        return;
      }

      await addDoc(collection(db, "dailyChickenRate"), rateData);
      toast.success("Chicken rate added successfully!");
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        breed: "",
        pricePerUnit: ""
      });
      setShowForm(false);
      loadRates();
    } catch (error) {
      console.error("Error adding rate:", error);
      toast.error("Failed to add chicken rate");
    }
  };

  const getLatestRate = () => {
    if (rates.length === 0) return null;
    const today = new Date().toISOString().split('T')[0];
    const latestRate = rates.find(r => {
      const rateDate = r.date?.toDate ? r.date.toDate().toISOString().split('T')[0] : null;
      return rateDate === today;
    });
    return latestRate || rates[0]; // Return today's rate or most recent
  };

  const filteredRates = rates.filter(rate =>
    rate.breed?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedRates = filteredRates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredRates.length / itemsPerPage);

  const latestRate = getLatestRate();

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Daily Chicken Rate Management</h2>
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
          {showForm ? "Cancel" : "Set Today's Rate"}
        </button>
      </div>

      {latestRate && (
        <div style={{
          backgroundColor: "#e3f2fd",
          border: "2px solid #2196F3",
          borderRadius: 10,
          padding: 20,
          marginBottom: 20
        }}>
          <h3 style={{ margin: 0, color: "#1976d2" }}>📊 Today's Active Rate</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, marginTop: 10 }}>
            <div>
              <p style={{ margin: 5, color: "#666" }}>Breed</p>
              <p style={{ fontSize: 24, fontWeight: "bold", margin: 0, color: "#1976d2" }}>
                {latestRate.breed}
              </p>
            </div>
            <div>
              <p style={{ margin: 5, color: "#666" }}>Price Per Unit</p>
              <p style={{ fontSize: 24, fontWeight: "bold", margin: 0, color: "#1976d2" }}>
                ${latestRate.pricePerUnit?.toFixed(2)}
              </p>
            </div>
            <div>
              <p style={{ margin: 5, color: "#666" }}>Date</p>
              <p style={{ fontSize: 24, fontWeight: "bold", margin: 0, color: "#1976d2" }}>
                {latestRate.date?.toDate ? latestRate.date.toDate().toLocaleDateString() : "N/A"}
              </p>
            </div>
          </div>
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
          <h3>Set Daily Chicken Rate</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 15 }}>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
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
              Save Rate
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by breed..."
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
                <tr style={{ backgroundColor: "#FF9800", color: "white" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Date</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Breed</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Price Per Unit</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRates.map((rate) => (
                  <tr key={rate.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 12 }}>
                      {rate.date?.toDate ? 
                        rate.date.toDate().toLocaleDateString() : "N/A"}
                    </td>
                    <td style={{ padding: 12 }}>{rate.breed}</td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                      ${rate.pricePerUnit?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredRates.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No rates found
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

export default DailyChickenRate;
