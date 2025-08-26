import React from "react";

import { HiOutlineCube } from "react-icons/hi";

function Payments() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Payment Managment</h3>
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
          <p style={{ color: "grey" }}>Total Payments</p>
          <h3>$976.49</h3>
          <p style={{ color: "grey" }}>From 5 Transations</p>
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
          <p style={{ color: "grey" }}> Paid</p>
          <h3> $560.74</h3>
          <p style={{ color: "grey" }}>3 Transations</p>
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
          <p style={{ color: "grey" }}>Outstanding</p>
          <h3> $415.75</h3>
          <p style={{ color: "grey" }}>3 Transations</p>
        </div>
      </span>

      <div
        style={{
          width: "1000px",
          height: "550px",
          backgroundColor: "whitesmoke",
          borderRadius: "10px",
        }}
      >
        <h4>Payment Transactions</h4>

        <p style={{ color: "grey" }}>
          {" "}
          Review and manage all payment transactions
        </p>

        <span>
          <input
            type="text"
            placeholder="Search by customer or order ID"
            style={{
              width: "600px",
              height: "40px",
              borderRadius: "10px",
              margin: "10px",
            }}
          />

          <input type="date" style={{ margin: "10px" }} />

          <input
            type="text"
            placeholder=" All Order"
            style={{ borderRadius: "10px" }}
          />
        </span>

        <table class="table">
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Method</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PAY-001</td>
              <td>ORD-001</td>
              <td>John Doe</td>
              <td>2025-05-18</td>
              <td>$240.50</td>
              <td class="pending">⏳ Pending</td>
              <td>Credit Card</td>
              <td>
                <button class="btn-invoice">Invoice</button>
              </td>
            </tr>
            <tr>
              <td>PAY-002</td>
              <td>ORD-002</td>
              <td>Jane Smith</td>
              <td>2025-05-17</td>
              <td>$120.75</td>
              <td class="paid">✔ Paid</td>
              <td>Mobile Payment</td>
              <td>
                <button class="btn-invoice">Invoice</button>
              </td>
            </tr>
            <tr>
              <td>PAY-003</td>
              <td>ORD-003</td>
              <td>Robert Johnson</td>
              <td>2025-05-17</td>
              <td>$350.00</td>
              <td class="paid">✔ Paid</td>
              <td>Bank Transfer</td>
              <td>
                <button class="btn-invoice">Invoice</button>
              </td>
            </tr>
            <tr>
              <td>PAY-004</td>
              <td>ORD-004</td>
              <td>Mary Williams</td>
              <td>2025-05-16</td>
              <td>$89.99</td>
              <td class="paid">✔ Paid</td>
              <td>Cash</td>
              <td>
                <button class="btn-invoice">Invoice</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Payments;
