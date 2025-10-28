import React, { useState, useEffect } from "react";
import { HiOutlineCube } from "react-icons/hi";
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import Chart from 'react-apexcharts';


  const optionOfBAr  = {
    chart: {
      id: 'apexchart-example',
      type: 'bar'
    },
    xaxis: {
      categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    }
  };

    const seriesOfBar  = [
    {
      name: 'series-1',
      data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
    }
  ];

const data = [
  { name: "Jan", sales2024: 30, sales2025: 50 },
  { name: "Feb", sales2024: 45, sales2025: 60 },
  { name: "Mar", sales2024: 28, sales2025: 40 },
  { name: "Apr", sales2024: 80, sales2025: 90 },
  { name: "May", sales2024: 60, sales2025: 80 },
  { name: "Jun", sales2024: 75, sales2025: 100 },
];


function ChickenSales() {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentChickenPrice, setCurrentChickenPrice] = useState(0);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averagePrice: 0
  });

  useEffect(() => {
    // Real-time listener for chicken price
    const priceQuery = query(
      collection(db, 'chickenPrices'),
      orderBy('date', 'desc'),
      limit(1)
    );
    
    const unsubscribePrice = onSnapshot(priceQuery, (snapshot) => {
      if (!snapshot.empty) {
        const latestPrice = snapshot.docs[0].data();
        setCurrentChickenPrice(latestPrice.pricePerKg || 0);
      }
    }, (error) => {
      console.error('Error fetching chicken price:', error);
    });

    // Real-time listener for chicken sales
    const salesQuery = query(collection(db, 'chickenSales'));
    const unsubscribeSales = onSnapshot(salesQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSalesData(data);

      // Calculate statistics
      const totalSales = data.reduce((sum, sale) => sum + (parseInt(sale.quantity) || 0), 0);
      const totalRevenue = data.reduce((sum, sale) => sum + (parseFloat(sale.totalPrice) || 0), 0);
      const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

      setStats({
        totalSales,
        totalRevenue,
        averagePrice
      });

      setLoading(false);
    }, (error) => {
      console.error('Error fetching chicken sales:', error);
      setLoading(false);
    });

    return () => {
      unsubscribePrice();
      unsubscribeSales();
    };
  }, []);

  // Group sales by month for chart
  const getMonthlyData = () => {
    const monthlyData = {};
    
    salesData.forEach(sale => {
      if (sale.date) {
        const date = new Date(sale.date);
        const monthKey = date.toLocaleString('default', { month: 'short' });
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { name: monthKey, sales: 0, revenue: 0 };
        }
        
        monthlyData[monthKey].sales += parseInt(sale.quantity) || 0;
        monthlyData[monthKey].revenue += parseFloat(sale.totalPrice) || 0;
      }
    });

    return Object.values(monthlyData);
  };

  // Get customer data for chart
  const getCustomerData = () => {
    const customerData = {};
    
    salesData.forEach(sale => {
      const customer = sale.customer || 'Unknown';
      if (!customerData[customer]) {
        customerData[customer] = 0;
      }
      customerData[customer] += parseInt(sale.quantity) || 0;
    });

    // Get top 5 customers
    return Object.entries(customerData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([customer, quantity]) => ({ customer, quantity }));
  };

  const chartData = getMonthlyData();
  const customerChartData = getCustomerData();

  const barOptions = {
    chart: {
      id: 'customer-sales',
      type: 'bar'
    },
    xaxis: {
      categories: customerChartData.map(c => c.customer)
    },
    title: {
      text: 'Top Customers by Sales Volume'
    }
  };

  const barSeries = [{
    name: 'Chickens Sold',
    data: customerChartData.map(c => c.quantity)
  }];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
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

      <h3>Chicken Sales</h3>

      {loading ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <p>Loading sales data...</p>
        </div>
      ) : (
        <>
          <span style={{ display: "flex", flexWrap: "wrap" }}>
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
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Current Price per Kg</p>
              <h3 style={{ margin: "0 0 10px 0" }}>{formatCurrency(currentChickenPrice)}</h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Live from price management</p>
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
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Total Sales</p>
              <h3 style={{ margin: "0 0 10px 0" }}>{stats.totalSales} chickens</h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Live from database</p>
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
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Average Price</p>
              <h3 style={{ margin: "0 0 10px 0" }}>{formatCurrency(stats.averagePrice)}/chicken</h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Per unit price</p>
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
              <p style={{ color: "grey", margin: "0 0 10px 0" }}>Total Revenue</p>
              <h3 style={{ margin: "0 0 10px 0" }}>{formatCurrency(stats.totalRevenue)}</h3>
              <p style={{ color: "grey", fontSize: "12px", margin: 0 }}>Total earnings</p>
            </div>
          </span>
        </>
      )}

      <span style={{ display: "flex" }}>
        <div
          style={{
            width: 450,
            height: 350,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
            padding: "15px"
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>Sales Trend</h4>
          <p style={{ color: "grey", margin: "0 0 15px 0" }}>
            Monthly chicken sales overview
          </p>

          {chartData.length === 0 ? (
            <p style={{ color: "grey", textAlign: "center", padding: "40px" }}>
              No sales data available for chart
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#ccc" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" name="Chickens Sold" />
                <Line type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenue (PKR)" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        <div
          style={{
            width: 450,
            height: 350,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
            padding: "15px"
          }}
        >
          <h4 style={{ margin: "0 0 10px 0" }}>Customer Analysis</h4>
          <p style={{ color: "grey", margin: "0 0 15px 0" }}>Top customers by sales volume</p>

          {customerChartData.length === 0 ? (
            <p style={{ color: "grey", textAlign: "center", padding: "40px" }}>
              No customer data available
            </p>
          ) : (
            <Chart options={barOptions} series={barSeries} type="bar" width="100%" height={250} />
          )}
        </div>
      </span>
    </div>
  );
}

export default ChickenSales;
