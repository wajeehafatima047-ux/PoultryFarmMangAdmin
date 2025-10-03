import React from "react";

import { SiNginxproxymanager } from "react-icons/si";
import { CiShoppingCart } from "react-icons/ci";

import { FaPerson } from "react-icons/fa6";

import { GiRoastChicken } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import img from "./img.png";

import { PieChart } from "react-minimal-pie-chart";

export default function Home() {
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
      <div style={{ display: "flex", gap: "30px", width: "1000px" }}>
        <div
          style={{
            width: 150,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <p style={{ color: "grey" }}>Total Orders</p>

            <span>
              <CiShoppingCart />
            </span>
          </div>

          <h4>128</h4>
          <p>+12% vs.last month </p>
        </div>

        <div
          style={{
            width: 150,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <p style={{ color: "grey" }}>Chicken Sale</p>

            <span>
              <GiRoastChicken />
            </span>
          </div>

          <h4>864</h4>
          <p> +8% vs.last month </p>
        </div>
        <div
          style={{
            width: 150,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
            <p style={{ color: "grey" }}> Active Employees</p>

            <span>
              <FaPerson />
            </span>
          </div>

          <h4>12</h4>
          <p>+2% vs.last month </p>
        </div>

        <div
          style={{
            width: 150,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "60px" }}>
            <p style={{ color: "grey" }}>Revenue</p>
            <span>
              <GiMoneyStack />
            </span>
          </div>

          <h4>$12,846</h4>
          <p>+5% vs.last month </p>
        </div>
      </div>
      <br />
      <span style={{ display: "flex" }}>
        <div
          style={{
            width: "500px",
            height: "100px",
            backgroundColor: "whitesmoke",
            margin: "10px",
            borderRadius: "10px",
          }}
        >
          <h4>Recent Orders</h4>

          <p style={{ color: "grey" }}>
            {" "}
            Order managment table will be implemented here
          </p>
        </div>
        <div
          style={{
            width: "300px",
            height: "100px",
            backgroundColor: "whitesmoke",
            margin: "10px",
            borderRadius: "10px",
          }}
        >
          <h4>Inventory Overview</h4>
          <p style={{ color: "grey" }}>
            Inventory Overview will be implemented here
          </p>
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
          }}
        >
          <h4>Financial Overview</h4>

          <span style={{ display: "flex", gap: "15px" }}>
            <div>
              <p style={{ color: "grey" }}>Total Income</p>

              <h3> $28,400</h3>
            </div>
            <div>
              <p style={{ color: "grey" }}>Total Expenses</p>

              <h3> $19,00</h3>
            </div>
            <div>
              <p style={{ color: "grey" }}>Net Profit</p>

              <h3> $9,400</h3>
            </div>
          </span>
        </div>
      </span>
      <div style={{ width: 300 }}>
     
      </div>
      ;{/* <img src="{img}" alt="pic" /> */}
    </div>
  );
}
