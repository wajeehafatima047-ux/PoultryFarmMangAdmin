import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFileText } from "react-icons/fi";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import { deleteData } from "../Helper/firebaseHelper";
import PaymentForm from "./PaymentForm";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    // Real-time listener for payments
    const paymentsQuery = query(collection(db, 'payments'));
    const unsubscribe = onSnapshot(paymentsQuery, (snapshot) => {
      const paymentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPayments(paymentsData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading payments:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment.id);
    setShowForm(true);
  };

  const handleDeletePayment = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await deleteData('payments', paymentId);
      } catch (error) {
        console.error('Error deleting payment:', error);
        alert('Failed to delete payment');
      }
    }
  };

  const handleFormSuccess = () => {
    // No need to reload, real-time listener handles it
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleGenerateInvoice = (payment) => {
    // Generate invoice functionality
    const invoiceData = {
      paymentId: payment.paymentid,
      orderId: payment.orderid,
      customer: payment.customer,
      date: payment.date,
      amount: payment.amount,
      method: payment.method,
      status: payment.status
    };
    
    // Create a simple invoice text
    const invoiceText = `
INVOICE
Payment ID: ${invoiceData.paymentId}
Order ID: ${invoiceData.orderId}
Customer: ${invoiceData.customer}
Date: ${invoiceData.date}
Amount: $${parseFloat(invoiceData.amount).toFixed(2)}
Method: ${invoiceData.method}
Status: ${invoiceData.status}
    `.trim();

    // Create and download invoice file
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${invoiceData.paymentId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Completed': return '#4caf50';
      case 'Failed': return '#f44336';
      case 'Refunded': return '#9c27b0';
      case 'Cancelled': return '#666';
      default: return '#666';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending': return '⏳';
      case 'Completed': return '✔';
      case 'Failed': return '❌';
      case 'Refunded': return '↩️';
      case 'Cancelled': return '🚫';
      default: return '❓';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.orderid?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    const matchesDate = !dateFilter || payment.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate summary statistics
  const totalPayments = payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  const paidPayments = payments.filter(p => p.status === 'Completed').reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);
  const pendingPayments = payments.filter(p => p.status === 'Pending').reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Payment Management</h3>

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
            justifyContent: "center"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Total Payments</p>
          <h3 style={{ margin: "10px 0", color: "#007bff" }}>${totalPayments.toFixed(2)}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>From {payments.length} Transactions</p>
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
            justifyContent: "center"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Paid</p>
          <h3 style={{ margin: "10px 0", color: "#4caf50" }}>${paidPayments.toFixed(2)}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>{payments.filter(p => p.status === 'Completed').length} Transactions</p>
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
            justifyContent: "center"
          }}
        >
          <p style={{ color: "grey", margin: 0, fontSize: "14px" }}>Outstanding</p>
          <h3 style={{ margin: "10px 0", color: "#ff9800" }}>${pendingPayments.toFixed(2)}</h3>
          <p style={{ color: "grey", margin: 0, fontSize: "12px" }}>{payments.filter(p => p.status === 'Pending').length} Transactions</p>
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
            <h4 style={{ margin: 0 }}>Payment Transactions</h4>
            <p style={{ color: "grey", margin: "5px 0 0 0" }}>Review and manage all payment transactions</p>
          </div>
          <button
            onClick={handleAddPayment}
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
            Add New Payment
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
            <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder="Search by customer, payment ID, or order ID"
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

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: "40px",
              borderRadius: "10px",
              border: "1px solid #ddd",
              padding: "0 10px",
              fontSize: "14px",
              minWidth: "150px"
            }}
          >
            <option value="All">All Payments</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading payments...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Payment ID</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Order ID</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Customer</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Amount</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Method</th>
                  <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                      {payments.length === 0 ? "No payments found. Create your first payment!" : "No payments match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{payment.paymentid}</td>
                      <td style={{ padding: "12px" }}>{payment.orderid}</td>
                      <td style={{ padding: "12px" }}>{payment.customer}</td>
                      <td style={{ padding: "12px" }}>{payment.date}</td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>${parseFloat(payment.amount || 0).toFixed(2)}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            backgroundColor: getStatusColor(payment.status),
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            width: "fit-content"
                          }}
                        >
                          {getStatusIcon(payment.status)} {payment.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>{payment.method}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleEditPayment(payment)}
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
                            onClick={() => handleGenerateInvoice(payment)}
                            style={{
                              backgroundColor: "#28a745",
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
                            <FiFileText size={12} />
                            Invoice
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
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
        <PaymentForm
          paymentId={editingPayment}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default Payments;