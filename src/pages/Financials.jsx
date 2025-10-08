import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi";
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../firebase';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function Financials() {
  const [financialData, setFinancialData] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    loading: true
  });
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const unsubscribers = [];

    // Listen to orders for revenue
    const ordersQuery = query(collection(db, 'orders'));
    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalRevenue = ordersData
        .filter(order => order.payments === 'Paid')
        .reduce((sum, order) => sum + (parseFloat(order.amount) || 0), 0);

      setFinancialData(prev => ({
        ...prev,
        totalRevenue,
        netProfit: totalRevenue - prev.totalExpenses,
        loading: false
      }));

      // Calculate monthly revenue
      const monthlyRevenue = {};
      ordersData.forEach(order => {
        if (order.date) {
          const month = new Date(order.date).toLocaleString('default', { month: 'short' });
          if (!monthlyRevenue[month]) monthlyRevenue[month] = 0;
          if (order.payments === 'Paid') {
            monthlyRevenue[month] += parseFloat(order.amount) || 0;
          }
        }
      });

      setMonthlyData(prev => {
        const updated = [...prev];
        Object.entries(monthlyRevenue).forEach(([month, revenue]) => {
          const existing = updated.find(d => d.month === month);
          if (existing) {
            existing.revenue = revenue;
          } else {
            updated.push({ month, revenue, expenses: 0 });
          }
        });
        return updated;
      });
    });
    unsubscribers.push(unsubOrders);

    // Listen to payroll for expenses
    const payrollQuery = query(collection(db, 'payroll'));
    const unsubPayroll = onSnapshot(payrollQuery, (snapshot) => {
      const payrollData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const totalExpenses = payrollData
        .filter(pay => pay.status === 'Paid')
        .reduce((sum, pay) => sum + (parseFloat(pay.netSalary) || 0), 0);

      setFinancialData(prev => ({
        ...prev,
        totalExpenses,
        netProfit: prev.totalRevenue - totalExpenses,
        loading: false
      }));

      // Calculate monthly expenses
      const monthlyExpenses = {};
      payrollData.forEach(pay => {
        if (pay.paymentDate) {
          const month = new Date(pay.paymentDate).toLocaleString('default', { month: 'short' });
          if (!monthlyExpenses[month]) monthlyExpenses[month] = 0;
          if (pay.status === 'Paid') {
            monthlyExpenses[month] += parseFloat(pay.netSalary) || 0;
          }
        }
      });

      setMonthlyData(prev => {
        const updated = [...prev];
        Object.entries(monthlyExpenses).forEach(([month, expenses]) => {
          const existing = updated.find(d => d.month === month);
          if (existing) {
            existing.expenses = expenses;
          } else {
            updated.push({ month, revenue: 0, expenses });
          }
        });
        return updated;
      });
    });
    unsubscribers.push(unsubPayroll);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Financial Dashboard</h3>

      {financialData.loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading financial data...</p>
        </div>
      ) : (
        <>
          <span style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <div
              style={{
                width: 350,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                margin: "10px",
                padding: "15px"
              }}
            >
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Total Revenue</p>
              <h3 style={{ margin: "0 0 10px 0", color: "#4caf50" }}>{formatCurrency(financialData.totalRevenue)}</h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>From paid orders</p>
            </div>

            <div
              style={{
                width: 350,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                margin: "10px",
                padding: "15px"
              }}
            >
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Total Expenses</p>
              <h3 style={{ margin: "0 0 10px 0", color: "#f44336" }}>{formatCurrency(financialData.totalExpenses)}</h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Payroll expenses</p>
            </div>

            <div
              style={{
                width: 350,
                height: 150,
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
                margin: "10px",
                padding: "15px"
              }}
            >
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Net Profit</p>
              <h3 style={{ 
                margin: "0 0 10px 0", 
                color: financialData.netProfit >= 0 ? "#4caf50" : "#f44336" 
              }}>
                {formatCurrency(financialData.netProfit)}
              </h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>
                {financialData.netProfit >= 0 ? "Profitable" : "Loss"}
              </p>
            </div>
          </span>

          <div
            style={{
              width: "1000px",
              minHeight: "500px",
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              margin: "10px",
              padding: "20px"
            }}
          >
            <h4 style={{ margin: "0 0 10px 0" }}>Profit & Loss Overview</h4>
            <p style={{ color: "grey", margin: "0 0 20px 0" }}>Track your financial performance over time</p>

            {monthlyData.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "grey" }}>No financial data available for chart</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#4caf50" name="Revenue" />
                  <Bar dataKey="expenses" fill="#f44336" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Financials;
