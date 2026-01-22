import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, Timestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GiRoastChicken } from "react-icons/gi";
import { CiShoppingCart } from "react-icons/ci";
import { GiMoneyStack } from "react-icons/gi";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [chickenInventory, setChickenInventory] = useState([]);
  const [dailyRates, setDailyRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryType: "delivery",
    address: "",
    breed: "",
    quantitySold: "",
    pricePerUnit: "",
    totalAmount: 0,
    orderStatus: "Pending",
    saleDate: new Date().toISOString().split('T')[0],
    invoiceId: ""
  });

  useEffect(() => {
    loadOrders();
    loadChickenInventory();
    loadDailyRates();
  }, []);

  useEffect(() => {
    const qty = parseFloat(formData.quantitySold) || 0;
    const price = parseFloat(formData.pricePerUnit) || 0;
    setFormData(prev => ({ ...prev, totalAmount: (qty * price).toFixed(2) }));
  }, [formData.quantitySold, formData.pricePerUnit]);

  useEffect(() => {
    // Auto-set price when breed is selected
    if (formData.breed && dailyRates.length > 0) {
      const latestRate = getLatestRateForBreed(formData.breed);
      if (latestRate) {
        setFormData(prev => ({ ...prev, pricePerUnit: latestRate.pricePerUnit }));
      }
    }
  }, [formData.breed, dailyRates]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "orders"), orderBy("saleDate", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const loadChickenInventory = async () => {
    try {
      const { getAllData } = await import("../Helper/firebaseHelper");
      const inventory = await getAllData("chickenInventory");
      setChickenInventory(inventory);
    } catch (error) {
      console.error("Error loading inventory:", error);
    }
  };

  const loadDailyRates = async () => {
    try {
      const q = query(collection(db, "dailyChickenRate"), orderBy("date", "desc"));
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setDailyRates(data);
    } catch (error) {
      console.error("Error loading rates:", error);
    }
  };

  const getLatestRateForBreed = (breed) => {
    if (dailyRates.length === 0) return null;
    const ratesForBreed = dailyRates.filter(r => r.breed === breed);
    if (ratesForBreed.length === 0) return null;
    return ratesForBreed[0]; // Already sorted by date desc
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedChicken = chickenInventory.find(ch => ch.breed === formData.breed);

      if (!selectedChicken) {
        toast.error("Please select a valid breed");
        return;
      }

      const quantitySold = parseFloat(formData.quantitySold);
      const availableStock = selectedChicken.totalInStock;

      if (quantitySold > availableStock) {
        toast.error(`Insufficient stock! Available: ${availableStock} chickens`);
        return;
      }

      const orderId = `ORD-${Date.now().toString().slice(-6)}`;
      const invoiceId = `INV-${Date.now().toString().slice(-6)}`;

      const orderData = {
        ...formData,
        orderId,
        invoiceId,
        quantitySold: quantitySold,
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalAmount: parseFloat(formData.totalAmount),
        saleDate: Timestamp.fromDate(new Date(formData.saleDate))
      };

      const docRef = await addDoc(collection(db, "orders"), orderData);
      
      // Update inventory
      await updateChickenInventory(selectedChicken.id, quantitySold);
      
      // Create invoice
      await createInvoice(invoiceId, "ChickenSale", docRef.id, orderData.totalAmount);
      
      // Create receipt
      await createReceipt(orderData.totalAmount, docRef.id);

      toast.success("Order placed successfully!");
      
      setFormData({
        customerName: "",
        customerPhone: "",
        deliveryType: "delivery",
        address: "",
        breed: "",
        quantitySold: "",
        pricePerUnit: "",
        totalAmount: 0,
        orderStatus: "Pending",
        saleDate: new Date().toISOString().split('T')[0],
        invoiceId: ""
      });
      setShowForm(false);
      loadOrders();
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    }
  };

  const updateChickenInventory = async (itemId, quantitySold) => {
    try {
      const { getDataById, updateData } = await import("../Helper/firebaseHelper");
      const item = await getDataById("chickenInventory", itemId);
      
      if (item) {
        const newStock = item.totalInStock - quantitySold;
        await updateData("chickenInventory", itemId, {
          totalInStock: Math.max(0, newStock),
          lastUpdated: Timestamp.now()
        });
        
        if (newStock < 50) {
          toast.warning(`Low stock alert: ${item.breed} has ${newStock} chickens remaining`);
        }
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const createInvoice = async (invoiceId, type, referenceId, totalAmount) => {
    try {
      const { addData } = await import("../Helper/firebaseHelper");
      await addData("invoices", {
        invoiceId,
        invoiceType: type,
        referenceId,
        date: Timestamp.now(),
        totalAmount: parseFloat(totalAmount),
        createdBy: "system"
      });
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  const createReceipt = async (amount, referenceId) => {
    try {
      const { addData } = await import("../Helper/firebaseHelper");
      await addData("receipts", {
        referenceId: referenceId || `sale_${Date.now()}`,
        description: "Chicken Sale",
        amount: parseFloat(amount),
        date: Timestamp.now(),
        createdBy: "system"
      });
    } catch (error) {
      console.error("Error creating receipt:", error);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { orderStatus: newStatus });
      toast.success("Order status updated successfully!");
      loadOrders();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  const handleCancelOrder = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      // Restore inventory
      const { getAllData, updateData } = await import("../Helper/firebaseHelper");
      const inventory = await getAllData("chickenInventory");
      const chickenItem = inventory.find(item => item.breed === order.breed);
      
      if (chickenItem) {
        await updateData("chickenInventory", chickenItem.id, {
          totalInStock: chickenItem.totalInStock + order.quantitySold,
          lastUpdated: Timestamp.now()
        });
      }

      // Delete order and related data
      await deleteDoc(doc(db, "orders", order.id));
      
      toast.success("Order cancelled and inventory restored!");
      loadOrders();
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "#ff9800",
      Approved: "#2196f3",
      Packed: "#9c27b0",
      OutForDelivery: "#03a9f4",
      Delivered: "#4caf50",
      Cancelled: "#f44336"
    };
    return colors[status] || "#666";
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerPhone?.includes(searchTerm) ||
                         order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.breed?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || order.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const statusOptions = ["Pending", "Approved", "Packed", "OutForDelivery", "Delivered"];

  // Calculate order statistics
  const calculateStats = () => {
    const totalOrders = orders.length;
    const totalChickensSold = orders.reduce((sum, order) => sum + (parseFloat(order.quantitySold) || 0), 0);
    const totalRevenue = orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
    const deliveredOrders = orders.filter(order => order.orderStatus === "Delivered").length;
    const pendingOrders = orders.filter(order => order.orderStatus === "Pending").length;
    const deliveredRevenue = orders
      .filter(order => order.orderStatus === "Delivered")
      .reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
      totalOrders,
      totalChickensSold,
      totalRevenue,
      deliveredOrders,
      pendingOrders,
      deliveredRevenue,
      averageOrderValue
    };
  };

  const stats = calculateStats();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Chicken Orders Management</h2>
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
          {showForm ? "Cancel" : "Place New Order"}
        </button>
      </div>

      {/* Chicken Sale Statistics Box */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {/* Total Orders Card */}
        <div style={{
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Total Orders</p>
            <span style={{ fontSize: "24px", color: "#007bff" }}>
              <CiShoppingCart />
            </span>
          </div>
          <h2 style={{ margin: "10px 0", color: "#333" }}>{stats.totalOrders}</h2>
          <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>All orders</p>
        </div>

        {/* Total Chickens Sold Card */}
        <div style={{
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Chickens Sold</p>
            <span style={{ fontSize: "24px", color: "#ff9800" }}>
              <GiRoastChicken />
            </span>
          </div>
          <h2 style={{ margin: "10px 0", color: "#333" }}>{stats.totalChickensSold}</h2>
          <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total quantity</p>
        </div>

        {/* Total Revenue Card */}
        <div style={{
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Total Revenue</p>
            <span style={{ fontSize: "24px", color: "#4caf50" }}>
              <GiMoneyStack />
            </span>
          </div>
          <h2 style={{ margin: "10px 0", color: "#4caf50", fontSize: "20px" }}>{formatCurrency(stats.totalRevenue)}</h2>
          <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>All orders</p>
        </div>

        {/* Delivered Orders Card */}
        <div style={{
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Delivered</p>
            <span style={{ fontSize: "24px", color: "#4caf50" }}>
              ✓
            </span>
          </div>
          <h2 style={{ margin: "10px 0", color: "#4caf50" }}>{stats.deliveredOrders}</h2>
          <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>{formatCurrency(stats.deliveredRevenue)}</p>
        </div>

        {/* Pending Orders Card */}
        <div style={{
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Pending</p>
            <span style={{ fontSize: "24px", color: "#ff9800" }}>
              ⏳
            </span>
          </div>
          <h2 style={{ margin: "10px 0", color: "#ff9800" }}>{stats.pendingOrders}</h2>
          <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Awaiting processing</p>
        </div>

        {/* Average Order Value Card */}
        <div style={{
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          padding: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Avg Order Value</p>
            <span style={{ fontSize: "24px", color: "#2196f3" }}>
              📊
            </span>
          </div>
          <h2 style={{ margin: "10px 0", color: "#2196f3", fontSize: "20px" }}>{formatCurrency(stats.averageOrderValue)}</h2>
          <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Per order</p>
        </div>
      </div>

      {showForm && (
        <div style={{
          backgroundColor: "#f5f5f5",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20,
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3>Place New Order</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 15 }}>
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Customer Phone"
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <select
                value={formData.deliveryType}
                onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
              {formData.deliveryType === "delivery" && (
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
                />
              )}
              <select
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              >
                <option value="">Select Breed</option>
                {chickenInventory.map((ch) => (
                  <option key={ch.id} value={ch.breed}>
                    {ch.breed} ({ch.totalInStock} available)
                  </option>
                ))}
              </select>
              <input
                type="number"
                step="1"
                placeholder="Quantity"
                value={formData.quantitySold}
                onChange={(e) => setFormData({ ...formData, quantitySold: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price Per Unit (Auto)"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                required
                style={{ padding: 10, borderRadius: 5, border: "1px solid #ddd" }}
              />
              <input
                type="text"
                placeholder="Total Amount (Auto)"
                value={formData.totalAmount}
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
              Place Order
            </button>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 15, marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Search by customer, phone, order ID, or breed..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ddd"
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: 10,
            borderRadius: 5,
            border: "1px solid #ddd"
          }}
        >
          <option value="All">All Status</option>
          {statusOptions.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 40 }}>Loading...</div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white" }}>
              <thead>
                <tr style={{ backgroundColor: "#4CAF50", color: "white" }}>
                  <th style={{ padding: 12, textAlign: "left" }}>Order ID</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Customer</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Breed</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Qty</th>
                  <th style={{ padding: 12, textAlign: "right" }}>Total</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Delivery</th>
                  <th style={{ padding: 12, textAlign: "left" }}>Status</th>
                  <th style={{ padding: 12, textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #ddd" }}>
                    <td style={{ padding: 12 }}>{order.orderId}</td>
                    <td style={{ padding: 12 }}>
                      {order.customerName}
                      <br />
                      <small style={{ color: "#666" }}>{order.customerPhone}</small>
                    </td>
                    <td style={{ padding: 12 }}>{order.breed}</td>
                    <td style={{ padding: 12, textAlign: "right" }}>{order.quantitySold}</td>
                    <td style={{ padding: 12, textAlign: "right", fontWeight: "bold" }}>
                      ${order.totalAmount?.toFixed(2)}
                    </td>
                    <td style={{ padding: 12 }}>
                      {order.deliveryType === "delivery" ? "🚚 Delivery" : "🏠 Pickup"}
                      {order.deliveryType === "delivery" && order.address && (
                        <>
                          <br /><small style={{ color: "#666" }}>{order.address.substring(0, 30)}...</small>
                        </>
                      )}
                    </td>
                    <td style={{ padding: 12 }}>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        disabled={order.orderStatus === "Cancelled" || order.orderStatus === "Delivered"}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 5,
                          border: "1px solid #ddd",
                          backgroundColor: getStatusColor(order.orderStatus),
                          color: "white",
                          fontWeight: "bold",
                          cursor: "pointer"
                        }}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: 12, textAlign: "center" }}>
                      {order.orderStatus !== "Cancelled" && (
                        <button
                          onClick={() => handleCancelOrder(order)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#f44336",
                            color: "white",
                            border: "none",
                            borderRadius: 3,
                            cursor: "pointer",
                            fontSize: 12
                          }}
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#666" }}>
              No orders found
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

export default Orders;

