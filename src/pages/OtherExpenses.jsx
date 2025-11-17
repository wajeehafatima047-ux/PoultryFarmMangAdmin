import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function OtherExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    expenseType: "vehicle",
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    vendorName: "",
    invoiceNumber: "",
    notes: ""
  });

  const expenseTypes = [
    { value: "vehicle", label: "🚗 Vehicle Repairing", icon: "🚗" },
    { value: "electricity", label: "💡 Electricity Bill", icon: "💡" },
    { value: "fuel", label: "⛽ Fuel", icon: "⛽" },
    { value: "maintenance", label: "🔧 Maintenance", icon: "🔧" },
    { value: "rent", label: "🏢 Rent", icon: "🏢" },
    { value: "insurance", label: "🛡️ Insurance", icon: "🛡️" },
    { value: "other", label: "📋 Other", icon: "📋" }
  ];

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "otherExpenses"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: Timestamp.fromDate(new Date(formData.date)),
        createdAt: Timestamp.now()
      };

      await addDoc(collection(db, "otherExpenses"), expenseData);
      
      // Also add to general expenses collection for reporting
      await addDoc(collection(db, "expenses"), {
        category: "otherExpenses",
        referenceId: `other_${Date.now()}`,
        description: `${expenseTypes.find(t => t.value === formData.expenseType)?.label} - ${formData.description}`,
        amount: parseFloat(formData.amount),
        date: Timestamp.fromDate(new Date(formData.date)),
        createdBy: "admin"
      });

      toast.success("Expense recorded successfully!");
      
      setFormData({
        expenseType: "vehicle",
        description: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        vendorName: "",
        invoiceNumber: "",
        notes: ""
      });
      setShowForm(false);
      loadExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to record expense");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await deleteDoc(doc(db, "otherExpenses", id));
        toast.success("Expense deleted successfully!");
        loadExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
        toast.error("Failed to delete expense");
      }
    }
  };

  const filteredExpenses = expenses.filter(expense =>
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.vendorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expenseTypes.find(t => t.value === expense.expenseType)?.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);

  const getTotalExpenses = () => {
    return filteredExpenses.reduce((total, expense) => total + (expense.amount || 0), 0);
  };

  const getExpensesByType = () => {
    const totals = {};
    expenseTypes.forEach(type => {
      totals[type.value] = filteredExpenses
        .filter(expense => expense.expenseType === type.value)
        .reduce((total, expense) => total + (expense.amount || 0), 0);
    });
    return totals;
  };

  const expensesByType = getExpensesByType();

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Other Expenses Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#FF6B6B",
            color: "white",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
            fontSize: 16
          }}
        >
          {showForm ? "Cancel" : "Add Expense"}
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 15, marginBottom: 20 }}>
        <div style={{ backgroundColor: "#FF6B6B", color: "white", padding: 15, borderRadius: 10, textAlign: "center" }}>
          <div style={{ fontSize: 24, fontWeight: "bold" }}>${getTotalExpenses().toFixed(2)}</div>
          <div style={{ fontSize: 14 }}>Total Expenses</div>
        </div>
        {expenseTypes.slice(0, 3).map(type => (
          <div key={type.value} style={{ backgroundColor: "#4ECDC4", color: "white", padding: 15, borderRadius: 10, textAlign: "center" }}>
            <div style={{ fontSize: 20 }}>{type.icon}</div>
            <div style={{ fontSize: 16, fontWeight: "bold" }}>${expensesByType[type.value].toFixed(2)}</div>
            <div style={{ fontSize: 12 }}>{type.label}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3>Record New Expense</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <select
                value={formData.expenseType}
                onChange={(e) => setFormData({ ...formData, expenseType: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              >
                {expenseTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Vendor Name (Optional)"
                value={formData.vendorName}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Invoice Number (Optional)"
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
            </div>
            <div style={{ marginTop: 15 }}>
              <textarea
                placeholder="Additional Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                style={{ 
                  width: "100%", 
                  padding: 10, 
                  borderRadius: 5, 
                  border: "1px solid #ddd",
                  resize: "vertical"
                }}
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
              Save Expense
            </button>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by description, vendor, or invoice..."
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
                <tr style={{ backgroundColor: "#FF6B6B", color: "white" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Date</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Type</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Description</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Vendor</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Amount</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Invoice</th>
                  <th style={{ padding: 12, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenses.map((expense) => {
                  const expenseType = expenseTypes.find(t => t.value === expense.expenseType);
                  return (
                    <tr key={expense.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: 12 }}>
                        {expense.date?.toDate ? 
                          expense.date.toDate().toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ padding: 12 }}>
                        <span style={{ fontSize: 16, marginRight: 5 }}>
                          {expenseType?.icon || "📋"}
                        </span>
                        {expenseType?.label || expense.expenseType}
                      </td>
                      <td style={{ padding: 12 }}>{expense.description}</td>
                      <td style={{ padding: 12 }}>{expense.vendorName || "N/A"}</td>
                      <td style={{ padding: 12, textAlign: "right", fontWeight: "bold", color: "#FF6B6B" }}>
                        ${expense.amount?.toFixed(2)}
                      </td>
                      <td style={{ padding: 12 }}>{expense.invoiceNumber || "N/A"}</td>
                      <td style={{ padding: 12, textAlign: "center" }}>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            borderRadius: 3,
                            cursor: "pointer",
                            fontSize: 12
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredExpenses.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No expenses found
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

export default OtherExpenses;
