import React from "react";

import { SiNginxproxymanager } from "react-icons/si";
import { CiShoppingCart } from "react-icons/ci";

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <SiNginxproxymanager />
        </span>
        <h2 style={{ margin: 0 }}>Poultry Management System</h2>
      </div>
      <div>
        <h3>Dashboard</h3>
      </div>

      {stats.loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          <div style={{ display: "flex", gap: "30px", width: "1000px" }}>
            <div
              style={{
                width: 150,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                padding: "15px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                <p style={{ color: "grey", margin: 0 }}>Total Orders</p>

                <span>
                  <CiShoppingCart />
                </span>
              </div>

              <h4 style={{ margin: "10px 0" }}>{stats.totalOrders}</h4>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Live from database</p>
            </div>

            <div
              style={{
                width: 150,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                padding: "15px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                <p style={{ color: "grey", margin: 0 }}>Chicken Sale</p>

                <span>
                  <GiRoastChicken />
                </span>
              </div>

              <h4 style={{ margin: "10px 0" }}>{stats.chickenSales}</h4>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total sold</p>
            </div>
            <div
              style={{
                width: 150,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                padding: "15px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
                <p style={{ color: "grey", margin: 0 }}>Active Employees</p>

                <span>
                  <FaPerson />
                </span>
              </div>

              <h4 style={{ margin: "10px 0" }}>{stats.activeEmployees}</h4>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Currently active</p>
            </div>

            <div
              style={{
                width: 150,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                padding: "15px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "60px" }}>
                <p style={{ color: "grey", margin: 0 }}>Revenue</p>
                <span>
                  <GiMoneyStack />
                </span>
              </div>

              <h4 style={{ margin: "10px 0" }}>{formatCurrency(stats.revenue)}</h4>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total revenue</p>
            </div>
          </div>
        </>
      )}
      <br />
      <span style={{ display: "flex" }}>
        <div
          style={{
            width: "500px",
            minHeight: "250px",
            backgroundColor: "whitesmoke",
            margin: "10px",
            borderRadius: "10px",
            padding: "15px"
          }}
        >
          <h4 style={{ margin: "0 0 15px 0" }}>Recent Orders</h4>

          {stats.recentOrders.length === 0 ? (
            <p style={{ color: "grey" }}>No recent orders found</p>
          ) : (
            <div style={{ overflowY: "auto", maxHeight: "200px" }}>
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: "white",
                    padding: "10px",
                    marginBottom: "8px",
                    borderRadius: "5px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <strong>{order.customer}</strong>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#666" }}>
                      {order.orderid} • {formatDate(order.date)}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <strong>{formatCurrency(order.amount)}</strong>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>
                      <span
                        style={{
                          backgroundColor: getStatusColor(order.status),
                          color: "white",
                          padding: "2px 6px",
                          borderRadius: "8px",
                          fontSize: "10px"
                        }}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          style={{
            width: "300px",
            minHeight: "250px",
            backgroundColor: "whitesmoke",
            margin: "10px",
            borderRadius: "10px",
            padding: "15px"
          }}
        >
          <h4 style={{ margin: "0 0 15px 0" }}>Inventory Overview</h4>
          <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px" }}>
            <p style={{ color: "grey", margin: "0 0 10px 0" }}>Low Stock Items</p>
            <h2 style={{ margin: "0 0 10px 0", color: stats.inventoryLowStock > 0 ? "#f44336" : "#4caf50" }}>
              {stats.inventoryLowStock}
            </h2>
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              {stats.inventoryLowStock > 0 
                ? "Items need restocking" 
                : "All items in stock"}
            </p>
          </div>
        </div>
      </span>
      <span style={{ display: "flex" }}>
        <div
          style={{
            width: "400px",
            height: "300px",
            backgroundColor: "whitesmoke",
            margin: "10px",
            borderRadius: "10px",
          }}
        >
          <h4>Sales Chart</h4>
          <p style={{ color: "grey" }}>Sales Chat will be implemented here</p>

             <PieChart
          segmentsStyle={{ width: 100 }}
          data={[
            { title: "One", value: 10, color: "#E38627" },
            { title: "Two", value: 15, color: "#C13C37" },
            { title: "Three", value: 20, color: "#6A2135" },
          ]}
        />
        </div>
        <div
          style={{
            width: "400px",
            height: "300px",
            backgroundColor: "whitesmoke",
            margin: "5px",
            borderRadius: "10px",
            padding: "15px"
          }}
        >
          <h4 style={{ margin: "0 0 20px 0" }}>Financial Overview</h4>

          {financials.loading ? (
            <p style={{ color: "grey" }}>Loading financial data...</p>
          ) : (
            <span style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px", flex: 1, minWidth: "100px" }}>
                <p style={{ color: "grey", margin: "0 0 10px 0", fontSize: "14px" }}>Total Income</p>
                <h3 style={{ margin: 0, color: "#4caf50" }}>{formatCurrency(financials.totalIncome)}</h3>
              </div>
              <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px", flex: 1, minWidth: "100px" }}>
                <p style={{ color: "grey", margin: "0 0 10px 0", fontSize: "14px" }}>Total Expenses</p>
                <h3 style={{ margin: 0, color: "#f44336" }}>{formatCurrency(financials.totalExpenses)}</h3>
              </div>
              <div style={{ backgroundColor: "white", padding: "15px", borderRadius: "5px", flex: 1, minWidth: "100px" }}>
                <p style={{ color: "grey", margin: "0 0 10px 0", fontSize: "14px" }}>Net Profit</p>
                <h3 style={{ margin: 0, color: financials.netProfit >= 0 ? "#4caf50" : "#f44336" }}>
                  {formatCurrency(financials.netProfit)}
                </h3>
              </div>
            </span>
          )}
        </div>
      </span>
      <div style={{ width: 300 }}>
     
      </div>
      ;{/* <img src="{img}" alt="pic" /> */}
    </div>
  );
}
