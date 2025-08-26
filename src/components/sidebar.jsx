import React from "react";
// import './sidebar.css'


import { RiDashboardHorizontalLine } from "react-icons/ri";
import { HiOutlineCube } from "react-icons/hi2";


import { FaPerson } from "react-icons/fa6";

import { MdInventory } from "react-icons/md";

import { GiRoastChicken } from "react-icons/gi";

import { GiMoneyStack } from "react-icons/gi";

import { CiSettings } from "react-icons/ci";

export default function Sidebar() {
  return (
    <div style={{ width: 200, height: "100%" }}>
      <ul style={{ textDecoration: "none" }}>
        
       
        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
           < RiDashboardHorizontalLine/>
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="/"
              >
                Dashboard
              </a>
            </div>
          </div>
        </li>




         <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>

                <HiOutlineCube />
  
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="  Orders"
              >
                Orders
              </a>
            </div>
          </div>
        </li>


        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
            

      <MdInventory/>


            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="Payments"
              >
                Payments
              </a>
            </div>
          </div>
        </li>

        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
              <FaPerson />
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="Employee "
              >
                Employee
              </a>
            </div>
          </div>
        </li>

        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
            <MdInventory />
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="Inventory"
              >
                Inventory
              </a>
            </div>
          </div>
        </li>

        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
             <GiRoastChicken />
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="ChickenSales"
              >
             ChickenSales
              </a>
            </div>
          </div>
        </li>

        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
            <GiMoneyStack />
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="Financials"
              >
              Financials
              </a>
            </div>
          </div>
        </li>


        <li style={{ listStyleType: "none", marginBottom: 5 }}>
          <div
            style={{
              display: "flex",
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: "#f2f2f2",
              borderRadius: 5,
            }}
          >
            <div style={{ width: 50 }}>
            <CiSettings />
            </div>

            <div>
              <a
                style={{ textDecoration: "none", color: "black" }}
                href="Setting"
              >
              Setting
              </a>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}
