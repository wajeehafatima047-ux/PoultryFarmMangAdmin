import React from "react";
import { HiOutlineCube } from "react-icons/hi";

function Financials() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Financial Dashboard</h3>

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
          <p style={{ color: "grey" }}>Total Revenue</p>
          <h3>$95,300</h3>
          <p style={{ color: "grey" }}>+12% YoY</p>
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
          <p style={{ color: "grey" }}>Total Expenses</p>
          <h3>$62,500</h3>
          <p style={{ color: "grey" }}>+12% YoY</p>
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
          <p style={{ color: "grey" }}>nET profit</p>
          <h3>$32,800</h3>
          <p style={{ color: "grey" }}>+8% YoY</p>
        </div>
      </span>

      <div
        style={{
          width:" 1000px",
          height: "500px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
          margin: "10px",
        }}
      >


        <h4>Profit & Loss Overview</h4>
        <p style={{color:"grey"}}>Track your Financial performance over time</p>
      </div>
    </div>
  );
}

export default Financials;
