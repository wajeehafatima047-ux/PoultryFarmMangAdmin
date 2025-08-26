import React from "react";

import { HiOutlineCube } from "react-icons/hi";
import { HiTemplate } from "react-icons/hi";

import { CgDanger } from "react-icons/cg";

function Inventory() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Inventory Managment</h3>
      <span style={{ display: "flex" }}>
        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <span style={{ display: "flex", gap: "10px" }}>
            <HiTemplate />
            <h4>Total Items</h4>
          </span>
          <h3>1</h3>
          <p style={{ color: "grey" }}>Across 4 categories</p>
        </div>

        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <span style={{ display: "flex", gap: "10px" }}>
            <CgDanger />
            <h4>Low Stock Items</h4>
          </span>
          <h3>1</h3>

          <p style={{ color: "grey" }}>Items need Restock</p>
        </div>

        <div
          style={{
            width: 250,
            height: 150,
            backgroundColor: "whitesmoke",
            borderRadius: "10px",
            margin: "10px",
          }}
        >
          <span style={{ display: "flex", gap: "70px" }}>
            {/* <img src="" alt="" /> */}
            <h4>Recent Activity</h4>
          </span>

          <h3>5</h3>

          <p style={{ color: "grey" }}>In a past 30 days</p>
        </div>
      </span>

        <span  style={{margin:"10px"}}>
          <button  style={{borderRadius:"10px"}} >Current Inventory</button>
          <button style={{borderRadius:"10px"}} > Transcations</button>
          <button style={{borderRadius:"10px"}} >Low Alert</button>
        </span>

      <div
        style={{
          width: "1000px",
          height: "400px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
        }}
      >
      

        <h4>Inventory Items</h4>
        <p style={{ color: "grey" }}>
          {" "}
          Manage your inventory items and stock items
        </p>

        <span>
          <input
            type="text"
            placeholder="Search Inventory Items...."
            style={{
              width: "300px",
              height: "40px",
              borderRadius: "10px",
              margin: "5px",
            }}
          />

          <button>Feed</button>
          <button>Medicine</button>
          <button>Eggs</button>
        </span>

        <table border="1" cellpadding="8" cellspacing="0" class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Supplier</th>
              <th>Last Restocked</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Chicken Feed - Regular<small>INV-001</small>
              </td>
              <td>Feed</td>
              <td>450 kg</td>
              <td>Farm Supplies Inc.</td>
              <td>2025-05-01</td>
              <td>Medium</td>
              <td>
                <button>Update</button>
              </td>
            </tr>
            <tr>
              <td>
                Chicken Feed - Premium <small>INV-002</small>
              </td>
              <td>Feed</td>
              <td>180 kg</td>
              <td>Organic Feeds Co.</td>
              <td>2025-04-15</td>
              <td>Medium</td>
              <td>
                <button>Update</button>
              </td>
            </tr>
            <tr>
              <td>
                Antibiotics<small>INV-003</small>
              </td>
              <td>Medicine</td>
              <td>45 bottles</td>
              <td>VetMed Supplies</td>
              <td>2025-03-10</td>
              <td>Medium</td>
              <td>
                <button>Update</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Inventory;
