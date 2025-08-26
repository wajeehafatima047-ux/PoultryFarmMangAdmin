import React from "react";
import { HiOutlineCube } from "react-icons/hi2";

import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

function Employee() {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Employee Managment</h3>

      <Tabs>
        <TabList>
          <Tab>Title 1</Tab>
          <Tab>Title 2</Tab>
          <Tab>Title 3</Tab>
        </TabList>

        <TabPanel>
          <div>
            <span>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                {" "}
                Employee
              </button>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                {" "}
                Attandance
              </button>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                Payroll
              </button>
            </span>

            <div
              style={{
                width: "1000px",
                height: "500px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
              }}
            >
              <h4>Employee Directory</h4>

              <p style={{ color: "grey" }}>
                Manage and update employee information
              </p>

              <input
                type="text"
                placeholder="Search Employees....."
                style={{
                  width: "300px",
                  height: "40px",
                  borderRadius: "10px",
                  margin: "10px",
                }}
              />

              <table class="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Contact</th>
                    <th>Joining Date</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Michael Chen</strong>EMP-001
                    </td>
                    <td>Farm Manager</td>
                    <td>michael@example.com</td>
                    <td>2023-01-15</td>
                    <td>$3,500</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Sarah Johnson</strong>EMP-002
                    </td>
                    <td>Poultry Specialist</td>
                    <td>sarah@example.com</td>
                    <td>2023-03-01</td>
                    <td>$2,800</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>David Rodriguez</strong>EMP-003
                    </td>
                    <td>Delivery Driver</td>
                    <td>david@example.com</td>
                    <td>2023-06-12</td>
                    <td>$2,400</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Lisa Patel</strong>EMP-004
                    </td>
                    <td>Farm Hand</td>
                    <td>lisa@example.com</td>
                    <td>2024-01-05</td>
                    <td>$2,200</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>James Wilson</strong>EMP-005
                    </td>
                    <td>Accountant</td>
                    <td>james@example.com</td>
                    <td>2023-09-18</td>
                    <td>$3,000</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <h2>Any content 2</h2>

          <div>
            <span>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                {" "}
                Employee
              </button>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                {" "}
                Attandance
              </button>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                Payroll
              </button>
            </span>

            <div
              style={{
                width: "1000px",
                height: "500px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
              }}
            >
              <h4>Employee Directory</h4>

              <p style={{ color: "grey" }}>
                Manage and update employee information
              </p>

              <input
                type="text"
                placeholder="Search Employees....."
                style={{
                  width: "300px",
                  height: "40px",
                  borderRadius: "10px",
                  margin: "10px",
                }}
              />

              <table class="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Contact</th>
                    <th>Joining Date</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Michael Chen</strong>EMP-001
                    </td>
                    <td>Farm Manager</td>
                    <td>michael@example.com</td>
                    <td>2023-01-15</td>
                    <td>$3,500</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Sarah Johnson</strong>EMP-002
                    </td>
                    <td>Poultry Specialist</td>
                    <td>sarah@example.com</td>
                    <td>2023-03-01</td>
                    <td>$2,800</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>David Rodriguez</strong>EMP-003
                    </td>
                    <td>Delivery Driver</td>
                    <td>david@example.com</td>
                    <td>2023-06-12</td>
                    <td>$2,400</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Lisa Patel</strong>EMP-004
                    </td>
                    <td>Farm Hand</td>
                    <td>lisa@example.com</td>
                    <td>2024-01-05</td>
                    <td>$2,200</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>James Wilson</strong>EMP-005
                    </td>
                    <td>Accountant</td>
                    <td>james@example.com</td>
                    <td>2023-09-18</td>
                    <td>$3,000</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
                

                    <h2>Any content 3</h2>

          <div>
            <span>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                {" "}
                Employee
              </button>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                {" "}
                Attandance
              </button>
              <button style={{ borderRadius: "10px", margin: "5px" }}>
                Payroll
              </button>
            </span>

            <div
              style={{
                width: "1000px",
                height: "500px",
                backgroundColor: "whitesmoke",
                borderRadius: "10px",
              }}
            >
              <h4>Employee Directory</h4>

              <p style={{ color: "grey" }}>
                Manage and update employee information
              </p>

              <input
                type="text"
                placeholder="Search Employees....."
                style={{
                  width: "300px",
                  height: "40px",
                  borderRadius: "10px",
                  margin: "10px",
                }}
              />

              <table class="table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Position</th>
                    <th>Contact</th>
                    <th>Joining Date</th>
                    <th>Salary</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <strong>Michael Chen</strong>EMP-001
                    </td>
                    <td>Farm Manager</td>
                    <td>michael@example.com</td>
                    <td>2023-01-15</td>
                    <td>$3,500</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Sarah Johnson</strong>EMP-002
                    </td>
                    <td>Poultry Specialist</td>
                    <td>sarah@example.com</td>
                    <td>2023-03-01</td>
                    <td>$2,800</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>David Rodriguez</strong>EMP-003
                    </td>
                    <td>Delivery Driver</td>
                    <td>david@example.com</td>
                    <td>2023-06-12</td>
                    <td>$2,400</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Lisa Patel</strong>EMP-004
                    </td>
                    <td>Farm Hand</td>
                    <td>lisa@example.com</td>
                    <td>2024-01-05</td>
                    <td>$2,200</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>James Wilson</strong>EMP-005
                    </td>
                    <td>Accountant</td>
                    <td>james@example.com</td>
                    <td>2023-09-18</td>
                    <td>$3,000</td>
                    <td>
                      <button class="edit-button">Edit</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
           
        </TabPanel>
      </Tabs>
    </>
  );
}

export default Employee;
