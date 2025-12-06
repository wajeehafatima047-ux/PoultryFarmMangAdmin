import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RiDashboardHorizontalLine } from "react-icons/ri";
import { FaPerson } from "react-icons/fa6";
import { GiRoastChicken } from "react-icons/gi";
import { GiMoneyStack } from "react-icons/gi";
import { CiSettings } from "react-icons/ci";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { BiSolidFoodMenu } from "react-icons/bi";
import { MdLocalPharmacy } from "react-icons/md";
import { MdFeaturedPlayList } from "react-icons/md";
import { MdAttachMoney } from "react-icons/md";

export default function Sidebar() {
  const [feedOpen, setFeedOpen] = useState(false);
  const [medicineOpen, setMedicineOpen] = useState(false);
  const [chickenOpen, setChickenOpen] = useState(false);

  return (
    <div style={{ 
      width: 260, 
      height: "100%", 
      backgroundColor: "#2c3e50",
      color: "white",
      padding: "20px 0"
    }}>
      {/* Sidebar Header */}
      <div style={{ 
        padding: "0 20px 20px 20px", 
        borderBottom: "1px solid #34495e",
        marginBottom: 20
      }}>
        <h2 style={{ 
          margin: 0, 
          fontSize: "20px", 
          fontWeight: "bold",
          color: "#3498db"
        }}>
          🐓 Farm Manager
        </h2>
      </div>

      <ul style={{ 
        listStyle: "none", 
        padding: 0, 
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "5px"
      }}>
        
        {/* Dashboard */}
        <li style={{ listStyleType: "none" }}>
          <a 
            href="/" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <RiDashboardHorizontalLine size={20} style={{ marginRight: 12 }} />
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Dashboard</span>
          </a>
        </li>

        {/* Employee */}
        <li style={{ listStyleType: "none" }}>
          <a 
            href="Employee" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <FaPerson size={20} style={{ marginRight: 12 }} />
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Employee</span>
          </a>
        </li>

        {/* Other Expenses */}
        <li style={{ listStyleType: "none" }}>
          <a 
            href="OtherExpenses" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <MdAttachMoney size={20} style={{ marginRight: 12 }} />
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Other Expenses</span>
          </a>
        </li>

        {/* Feed Management Dropdown */}
        <li style={{ listStyleType: "none" }}>
          <div
            onClick={() => setFeedOpen(!feedOpen)}
            style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = feedOpen ? "#34495e" : "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <BiSolidFoodMenu size={20} style={{ marginRight: 12 }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Feed Management</span>
            </div>
            {feedOpen ? <IoMdArrowDropup size={18} /> : <IoMdArrowDropdown size={18} />}
          </div>
          {feedOpen && (
            <ul style={{ 
              margin: "5px 0 5px 0", 
              padding: "0 0 0 15px",
              backgroundColor: "#1a252f",
              borderLeft: "3px solid #3498db"
            }}>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="FeedPurchase"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  📦 Feed Purchase
                </a>
              </li>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="FeedUsage"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  🥄 Feed Usage
                </a>
              </li>
              <li style={{ listStyleType: "none" }}>
                <a
                  href="FeedInventory"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  📊 Feed Inventory
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Medicine Management Dropdown */}
        <li style={{ listStyleType: "none" }}>
          <div
            onClick={() => setMedicineOpen(!medicineOpen)}
            style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = medicineOpen ? "#34495e" : "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <MdLocalPharmacy size={20} style={{ marginRight: 12 }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Medicine Management</span>
            </div>
            {medicineOpen ? <IoMdArrowDropup size={18} /> : <IoMdArrowDropdown size={18} />}
          </div>
          {medicineOpen && (
            <ul style={{ 
              margin: "5px 0 5px 0", 
              padding: "0 0 0 15px",
              backgroundColor: "#1a252f",
              borderLeft: "3px solid #3498db"
            }}>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="MedicinePurchase"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  💊 Medicine Purchase
                </a>
              </li>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="MedicineUsage"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  💉 Medicine Usage
                </a>
              </li>
              <li style={{ listStyleType: "none" }}>
                <a
                  href="MedicineInventory"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  📋 Medicine Inventory
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Chicken Management Dropdown */}
        <li style={{ listStyleType: "none" }}>
          <div
            onClick={() => setChickenOpen(!chickenOpen)}
            style={{ 
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 20px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = chickenOpen ? "#34495e" : "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <GiRoastChicken size={20} style={{ marginRight: 12 }} />
              <span style={{ fontSize: "15px", fontWeight: "500" }}>Chicken Management</span>
            </div>
            {chickenOpen ? <IoMdArrowDropup size={18} /> : <IoMdArrowDropdown size={18} />}
          </div>
          {chickenOpen && (
            <ul style={{ 
              margin: "5px 0 5px 0", 
              padding: "0 0 0 15px",
              backgroundColor: "#1a252f",
              borderLeft: "3px solid #3498db"
            }}>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="PurchaseChicken"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  🐔 Chicken Purchase
                </a>
              </li>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="ChickenInventory"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  📈 Chicken Inventory
                </a>
              </li>
              <li style={{ listStyleType: "none", marginBottom: 5 }}>
                <a
                  href="Orders"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  📝 Orders
                </a>
              </li>
              <li style={{ listStyleType: "none" }}>
                <a
                  href="DailyChickenRate"
                  style={{ 
                    display: "block",
                    padding: "10px 15px",
                    color: "#bdc3c7",
                    textDecoration: "none",
                    fontSize: 14,
                    borderRadius: "5px",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#bdc3c7";
                  }}
                >
                  💰 Daily Rates
                </a>
              </li>
            </ul>
          )}
        </li>

        {/* Invoices */}
        <li style={{ listStyleType: "none" }}>
          <a 
            href="Invoices" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <GiMoneyStack size={20} style={{ marginRight: 12 }} />
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Invoices</span>
          </a>
        </li>

        {/* Customer Chats */}
        <li style={{ listStyleType: "none" }}>
          <Link 
            to="/chat" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <span style={{ fontSize: 20, marginRight: 12 }}>💬</span>
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Customer Chats</span>
          </Link>
        </li>

        {/* Feature Management */}
        <li style={{ listStyleType: "none" }}>
          <a 
            href="FeatureManagement" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <MdFeaturedPlayList size={20} style={{ marginRight: 12 }} />
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Feature Management</span>
          </a>
        </li>

        {/* Settings */}
        <li style={{ listStyleType: "none", marginTop: "auto" }}>
          <a 
            href="Setting" 
            style={{ 
              display: "flex",
              alignItems: "center",
              padding: "12px 20px",
              color: "white",
              textDecoration: "none",
              transition: "all 0.3s ease",
              borderRadius: "0 25px 25px 0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#34495e";
              e.currentTarget.style.paddingLeft = "25px";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.paddingLeft = "20px";
            }}
          >
            <CiSettings size={20} style={{ marginRight: 12 }} />
            <span style={{ fontSize: "15px", fontWeight: "500" }}>Settings</span>
          </a>
        </li>
      </ul>
    </div>
  );
}
