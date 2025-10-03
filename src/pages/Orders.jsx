import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi2";
import { FiPlus, FiEdit, FiTrash2, FiSearch } from "react-icons/fi";
import { getAllData, deleteData } from "../Helper/firebaseHelper";
import OrderForm from "./OrderForm";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getAllData('orders');
      setOrders(ordersData || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setShowForm(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order.id);
    setShowForm(true);
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteData('orders', orderId);
        loadOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
        alert('Failed to delete order');
      }
    }
  };

  const handleFormSuccess = () => {
    loadOrders();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOrder(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Confirmed': return '#2196f3';
      case 'Out for Delivery': return '#9c27b0';
      case 'Delivered': return '#4caf50';
      case 'Cancelled': return '#f44336';
      default: return '#666';
    }
  };

  const getPaymentColor = (payment) => {
    switch (payment) {
      case 'Paid': return '#4caf50';
      case 'Unpaid': return '#f44336';
      case 'Partial': return '#ff9800';
      default: return '#666';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderid?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    const matchesDate = !dateFilter || order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Order Management</h3>

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
            <h4 style={{ margin: 0 }}>Orders</h4>
            <p style={{ color: "grey", margin: "5px 0 0 0" }}>Manage and monitor your chicken delivery orders</p>
          </div>
          <button
            onClick={handleAddOrder}
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
            Add New Order
          </button>
        </div>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
            <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
            <input
              type="text"
              placeholder="Search by customer or order ID"
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
            <option value="All">All Orders</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <p>Loading orders...</p>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Order ID</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Customer</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Amount</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Items</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Payment</th>
                  <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                      {orders.length === 0 ? "No orders found. Create your first order!" : "No orders match your search criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "12px", fontWeight: "500" }}>{order.orderid}</td>
                      <td style={{ padding: "12px" }}>{order.customer}</td>
                      <td style={{ padding: "12px" }}>{order.date}</td>
                      <td style={{ padding: "12px", fontWeight: "500" }}>${parseFloat(order.amount || 0).toFixed(2)}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            backgroundColor: getStatusColor(order.status),
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px", maxWidth: "200px", wordWrap: "break-word" }}>{order.items}</td>
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            backgroundColor: getPaymentColor(order.payments),
                            color: "white",
                            padding: "4px 8px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}
                        >
                          {order.payments}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button
                            onClick={() => handleEditOrder(order)}
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
                            onClick={() => handleDeleteOrder(order.id)}
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
        <OrderForm
          orderId={editingOrder}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
}

export default Orders;