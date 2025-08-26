import React from "react";
import { HiOutlineCube } from "react-icons/hi";

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
  
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Chicken Sales</h3>

      <span style={{ display: "flex" }}>
        <div
          style={{
            width: 350,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <p style={{ color: "grey" }}>Total Sales</p>
          <h3>650 chickens</h3>
          <p style={{ color: "grey" }}>+12% from last month</p>
        </div>

        <div
          style={{
            width: 350,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <p style={{ color: "grey" }}>Total Sales</p>
          <h3>650 chickens</h3>
          <p style={{ color: "grey" }}>+12% from last month</p>
        </div>

        <div
          style={{
            width: 350,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <p style={{ color: "grey" }}>Total Revenue</p>
          <h3>$3,555</h3>
          <p style={{ color: "grey" }}>+8% from last month</p>
        </div>
      </span>

      <span style={{ display: "flex" }}>
        <div
          style={{
            width: 450,
            height: 350,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <h4> Sales & Forecast</h4>
          <p style={{ color: "grey" }}>
            Year-to-date chicken sales with forecast
          </p>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <CartesianGrid stroke="#ccc" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales2024" stroke="#8884d8" />
              <Line type="monotone" dataKey="sales2025" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div
          style={{
            width: 450,
            height: 350,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <h4>Customer Analysis</h4>
          <p style={{ color: "grey" }}>top customers by sales volume</p>


            <Chart options={optionOfBAr} series={seriesOfBar} type="bar" width="100%" height={250} />
                         
        </div>
      </span>
    </div>
  );
}

export default ChickenSales;
