import React from "react";

import { HiOutlineCube } from "react-icons/hi2";

function Orders() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Order Managment</h3>

      <div
        style={{
          width:'1000px',
          height:"500px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
        }}
      >



        <h4>Orders</h4>

        <p style={{color:"grey"}}>Manage and moinater your chicken delievery</p>

          <span>


           
                <input type="text" placeholder="Search by customer or order ID"   style={{ width: "600px", height: "40px",borderRadius:"10px" ,margin:"10px"}}  />

              <input type="date" style={{margin:"10px"}}/>


              <input type="text" placeholder=" All Order" style={{borderRadius:"10px"}}/>
       
          </span>



 

  <table   class="table">
    <thead>
      <tr>
        <th>Order ID</th>
        <th>Customer</th>
        <th>Date</th>
        <th>Amount</th>
        <th>Status</th>
        <th>Items</th>
        <th>Payment</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>ORD-001</td>
        <td>John Doe</td>
        <td>2025-05-18</td>
        <td>$240.50</td>
        <td>Pending</td>
        <td>10 Chickens, 2 Feed Bags</td>
        <td><strong>Pending</strong></td>
        <td><button class="btn">Edit</button></td>
      </tr>
      <tr>
        <td>ORD-002</td>
        <td>Jane Smith</td>
        <td>2025-05-17</td>
        <td>$120.75</td>
        <td>Confirmed</td>
        <td>5 Chickens</td>
        <td><strong>Paid</strong></td>
        <td><button class="btn">Edit</button></td>
      </tr>
      <tr>
        <td>ORD-003</td>
        <td>Robert Johnson</td>
        <td>2025-05-17</td>
        <td>$360.00</td>
        <td>Out for Delivery</td>
        <td>15 Chickens, 4 Feed Bags</td>
        <td><strong>Paid</strong></td>
        <td><button class="btn">Edit</button></td>
      </tr>
      <tr>
        <td>ORD-004</td>
        <td>Mary Williams</td>
        <td>2025-05-15</td>
        <td>$89.99</td>
        <td>Delivered</td>
        <td>3 Chickens, 1 Medicine Pack</td>
        <td><strong>Paid</strong></td>
        <td><button class="btn">Edit</button></td>
      </tr>
      <tr>
        <td>ORD-005</td>
        <td>David Brown</td>
        <td>2025-05-15</td>
        <td>$175.25</td>
        <td>Confirmed</td>
        <td>8 Chickens</td>
        <td><strong>Unpaid</strong></td>
        <td><button class="btn">Edit</button></td>
      </tr>
      <tr>
        <td>ORD-006</td>
        <td>Emma Wilson</td>
        <td>2025-05-14</td>
        <td>$412.75</td>
        <td>Delivered</td>
        <td>18 Chickens, 3 Feed Bags</td>
        <td><strong>Paid</strong></td>
        <td><button class="btn">Edit</button></td>
      </tr>
    </tbody>
  </table>


      
      </div>
    </div>
  );
}

export default Orders;
