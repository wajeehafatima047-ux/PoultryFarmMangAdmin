import React from "react";

import { SiNginxproxymanager } from "react-icons/si";
import { CiShoppingCart } from "react-icons/ci";
import { BiSolidFoodMenu } from "react-icons/bi";
import { FaPerson } from "react-icons/fa6";
import { GiRoastChicken } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import img from "./img.png";

import { PieChart } from "react-minimal-pie-chart";
import { useDashboardStats, useFinancialStats } from "../hooks/useDashboardStats";

export default function Home() {
  // Get real-time dashboard statistics
  const stats = useDashboardStats();
  const financials = useFinancialStats();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color for orders
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

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <span style={{ fontSize: "24px", color: "#007bff" }}>
          <SiNginxproxymanager />
        </span>
        <h2 style={{ margin: 0 }}>Poultry Management System</h2>
      </div>

      <h3 style={{ marginBottom: "20px", color: "#333" }}>Dashboard</h3>

      {stats.loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards Section - Row 1 */}
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
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Live from database</p>
            </div>

            {/* Chicken Sales Card */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Chicken Sales</p>
                <span style={{ fontSize: "24px", color: "#ff9800" }}>
                  <GiRoastChicken />
                </span>
              </div>
              <h2 style={{ margin: "10px 0", color: "#333" }}>{stats.chickenSales}</h2>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total sold</p>
            </div>

            {/* Active Employees Card */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Active Employees</p>
                <span style={{ fontSize: "24px", color: "#9c27b0" }}>
                  <FaPerson />
                </span>
              </div>
              <h2 style={{ margin: "10px 0", color: "#333" }}>{stats.activeEmployees}</h2>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Currently active</p>
            </div>

            {/* Revenue Card */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Revenue</p>
                <span style={{ fontSize: "24px", color: "#4caf50" }}>
                  <GiMoneyStack />
                </span>
              </div>
              <h2 style={{ margin: "10px 0", color: "#4caf50", fontSize: "20px" }}>{formatCurrency(stats.revenue)}</h2>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total revenue</p>
            </div>

            {/* Feed Stock Card */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Feed Stock</p>
                <span style={{ fontSize: "24px", color: "#795548" }}>
                  <BiSolidFoodMenu />
                </span>
              </div>
              <h2 style={{ margin: "10px 0", color: "#333" }}>{stats.totalFeedStock.toFixed(2)} kg</h2>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total in stock</p>
            </div>

            {/* Chicken Stock Card */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <p style={{ color: "grey", margin: 0, fontSize: "14px", fontWeight: "500" }}>Chicken Stock</p>
                <span style={{ fontSize: "24px", color: "#ff5722" }}>
                  <GiRoastChicken />
                </span>
              </div>
              <h2 style={{ margin: "10px 0", color: "#333" }}>{stats.totalChickenStock}</h2>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total in stock</p>
            </div>
          </div>

          {/* Recent Orders and Inventory Section - Row 2 */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "2fr 1fr", 
            gap: "20px", 
            marginBottom: "30px" 
          }}>
            {/* Recent Orders */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>Recent Orders</h4>
              {stats.recentOrders.length === 0 ? (
                <p style={{ color: "grey", textAlign: "center", padding: "20px" }}>No recent orders found</p>
              ) : (
                <div style={{ overflowY: "auto", maxHeight: "300px" }}>
                  {stats.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: "white",
                        padding: "15px",
                        marginBottom: "10px",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: "14px" }}>{order.customerName || "N/A"}</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>
                          {order.orderId} • {order.saleDate?.toDate ? order.saleDate.toDate().toLocaleDateString() : "N/A"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <strong style={{ fontSize: "14px" }}>{formatCurrency(order.totalAmount || 0)}</strong>
                        <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
                          <span
                            style={{
                              backgroundColor: getStatusColor(order.orderStatus),
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "500"
                            }}
                          >
                            {order.orderStatus}
                          </span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Inventory Overview */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>Inventory Overview</h4>
              <div style={{ 
                backgroundColor: "white", 
                padding: "30px", 
                borderRadius: "8px",
                textAlign: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <p style={{ color: "grey", margin: "0 0 15px 0", fontSize: "14px" }}>Low Stock Items</p>
                <h1 style={{ 
                  margin: "0 0 15px 0", 
                  color: stats.inventoryLowStock > 0 ? "#f44336" : "#4caf50",
                  fontSize: "48px"
                }}>
                  {stats.inventoryLowStock}
                </h1>
                <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                  {stats.inventoryLowStock > 0 
                    ? "⚠️ Items need restocking" 
                    : "✅ All items in stock"}
                </p>
              </div>
            </div>
          </div>

          {/* Financial Overview and Sales Chart Section - Row 3 */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "20px", 
            marginBottom: "30px" 
          }}>
            {/* Financial Overview */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 20px 0", color: "#333" }}>Financial Overview</h4>
              {financials.loading ? (
                <p style={{ color: "grey", textAlign: "center", padding: "20px" }}>Loading financial data...</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                  {/* Total Income */}
                  <div style={{ 
                    backgroundColor: "white", 
                    padding: "20px", 
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}>
                    <p style={{ color: "grey", margin: "0 0 10px 0", fontSize: "14px" }}>💰 Total Income</p>
                    <h2 style={{ margin: 0, color: "#4caf50", fontSize: "24px" }}>
                      {formatCurrency(financials.totalIncome)}
                    </h2>
                  </div>

                  {/* Total Expenses */}
                  <div style={{ 
                    backgroundColor: "white", 
                    padding: "20px", 
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}>
                    <p style={{ color: "grey", margin: "0 0 10px 0", fontSize: "14px" }}>💸 Total Expenses</p>
                    <h2 style={{ margin: 0, color: "#f44336", fontSize: "24px" }}>
                      {formatCurrency(financials.totalExpenses)}
                    </h2>
                  </div>

                  {/* Net Profit */}
                  <div style={{ 
                    backgroundColor: "white", 
                    padding: "20px", 
                    borderRadius: "8px",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}>
                    <p style={{ color: "grey", margin: "0 0 10px 0", fontSize: "14px" }}>📊 Net Profit</p>
                    <h2 style={{ 
                      margin: 0, 
                      color: financials.netProfit >= 0 ? "#4caf50" : "#f44336",
                      fontSize: "24px"
                    }}>
                      {formatCurrency(financials.netProfit)}
                    </h2>
                  </div>
                </div>
              )}
            </div>

            {/* Sales Chart */}
            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}>
              <h4 style={{ margin: "0 0 15px 0", color: "#333" }}>Sales Distribution</h4>
              <div style={{ 
                backgroundColor: "white", 
                padding: "20px", 
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "300px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
              }}>
                <PieChart
                  style={{ height: "250px" }}
                  data={[
                    { title: "Orders", value: 10, color: "#E38627" },
                    { title: "Sales", value: 15, color: "#C13C37" },
                    { title: "Revenue", value: 20, color: "#6A2135" },
                  ]}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
