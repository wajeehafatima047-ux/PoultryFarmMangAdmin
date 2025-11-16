import React, { useState, useEffect } from "react";
import { HiOutlineCube, HiPlus, HiPencil, HiTrash, HiEye } from "react-icons/hi2";
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiUser } from "react-icons/fi";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { getAllData, deleteData } from "../Helper/firebaseHelper";
import EmployeeForm from "./EmployeeForm";
import EmployeeAttendanceForm from "./EmployeeAttendanceForm";
import EmployeePaymentForm from "./EmployeePaymentForm";

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Attendance state
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('');
  const [attendanceStatusFilter, setAttendanceStatusFilter] = useState('All');
  const [attendanceDateFilter, setAttendanceDateFilter] = useState('');
  const [showAttendanceForm, setShowAttendanceForm] = useState(false);
  const [editingAttendance, setEditingAttendance] = useState(null);
  
  // Payroll state
  const [payroll, setPayroll] = useState([]);
  const [filteredPayroll, setFilteredPayroll] = useState([]);
  const [payrollSearchTerm, setPayrollSearchTerm] = useState('');
  const [payrollStatusFilter, setPayrollStatusFilter] = useState('All');
  const [showPayrollForm, setShowPayrollForm] = useState(false);
  const [editingPayroll, setEditingPayroll] = useState(null);


  // Filter employees based on search term and status
  useEffect(() => {
    let filtered = employees;
    
    // Filter by search term
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(employee =>
        (employee.employee || employee.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.employeeId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.position || employee.role || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.contact || employee.phone || '').includes(searchTerm) ||
        (employee.cnic || '').includes(searchTerm)
      );
    }
    
    // Filter by status
    if (statusFilter !== 'All') {
      filtered = filtered.filter(employee => 
        (employee.status || 'Active') === statusFilter
      );
    }
    
      setFilteredEmployees(filtered);
  }, [searchTerm, statusFilter, employees]);

  // Filter attendance based on search term, status, and date
  useEffect(() => {
    let filtered = attendance;
    
    // Filter by search term
    if (attendanceSearchTerm.trim() !== "") {
      filtered = filtered.filter(record => {
        const employee = employees.find(emp => emp.id === record.employee);
        return employee && (
          (employee.employee || employee.name || '').toLowerCase().includes(attendanceSearchTerm.toLowerCase()) ||
          (employee.position || employee.role || '').toLowerCase().includes(attendanceSearchTerm.toLowerCase())
        );
      });
    }
    
    // Filter by status
    if (attendanceStatusFilter !== 'All') {
      filtered = filtered.filter(record => record.status === attendanceStatusFilter);
    }
    
    // Filter by date
    if (attendanceDateFilter) {
      filtered = filtered.filter(record => record.date === attendanceDateFilter);
    }
    
    setFilteredAttendance(filtered);
  }, [attendanceSearchTerm, attendanceStatusFilter, attendanceDateFilter, attendance, employees]);

  // Filter payroll based on search term and status
  useEffect(() => {
    let filtered = payroll;
    

    // Filter by search term
    if (payrollSearchTerm.trim() !== "") {
      filtered = filtered.filter(record => {
        const employee = employees.find(emp => emp.id === record.employee);
        return employee && (
          (employee.employee || employee.name || '').toLowerCase().includes(payrollSearchTerm.toLowerCase()) ||
          (employee.position || employee.role || '').toLowerCase().includes(payrollSearchTerm.toLowerCase()) ||
          (record.position || '').toLowerCase().includes(payrollSearchTerm.toLowerCase())
        );
      });
    }
    
    // Filter by status
    if (payrollStatusFilter !== 'All') {
      filtered = filtered.filter(record => record.status === payrollStatusFilter);
    }
    
    setFilteredPayroll(filtered);
  }, [payrollSearchTerm, payrollStatusFilter, payroll, employees]);

  // Generate unique employee ID
  const generateEmployeeId = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `EMP-${timestamp}${random}`;
  };

  // Load all employees from Firestore
  const loadEmployees = async () => {
    try {
      setLoading(true);
      const employeeData = await getAllData("employees");
      setEmployees(employeeData || []);
    } catch (error) {
      console.error("Error loading employees:", error);
      alert("Error loading employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setShowForm(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee.id);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    loadEmployees();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  // Attendance functions
  const loadAttendance = async () => {
    try {
      setLoading(true);
      const attendanceData = await getAllData('attendance');
      setAttendance(attendanceData || []);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAttendance = () => {
    setEditingAttendance(null);
    setShowAttendanceForm(true);
  };

  const handleEditAttendance = (attendanceRecord) => {
    setEditingAttendance(attendanceRecord.id);
    setShowAttendanceForm(true);
  };

  const handleDeleteAttendance = async (attendanceId) => {
    const attendanceRecord = attendance.find(att => att.id === attendanceId);
    const employee = employees.find(emp => emp.id === attendanceRecord?.employee);
    const employeeName = employee?.employee || employee?.name || 'this employee';
    
    if (window.confirm(`Are you sure you want to delete attendance record for ${employeeName}?`)) {
      try {
        setLoading(true);
        await deleteData('attendance', attendanceId);
        loadAttendance();
      } catch (error) {
        console.error('Error deleting attendance:', error);
        alert('Error deleting attendance record. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAttendanceFormSuccess = () => {
    loadAttendance();
  };

  const handleCloseAttendanceForm = () => {
    setShowAttendanceForm(false);
    setEditingAttendance(null);
  };

  // Payroll functions
  const loadPayroll = async () => {
    try {
      setLoading(true);
      const payrollData = await getAllData('salaryPayments');
      setPayroll(payrollData || []);
    } catch (error) {
      console.error('Error loading payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayroll = () => {
    setEditingPayroll(null);
    setShowPayrollForm(true);
  };

  const handleEditPayroll = (payrollRecord) => {
    setEditingPayroll(payrollRecord.id);
    setShowPayrollForm(true);
  };

  const handleDeletePayroll = async (payrollId) => {
    const payrollRecord = payroll.find(pay => pay.id === payrollId);
    const employee = employees.find(emp => emp.id === payrollRecord?.employeeId || emp.id === payrollRecord?.employee);
    const employeeName = employee?.employee || employee?.name || 'this employee';
    
    if (window.confirm(`Are you sure you want to delete payroll record for ${employeeName}?`)) {
      try {
        setLoading(true);
        await deleteData('salaryPayments', payrollId);
        loadPayroll();
      } catch (error) {
        console.error('Error deleting payroll:', error);
        alert('Error deleting payroll record. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePayrollFormSuccess = () => {
    loadPayroll();
  };

  const handleClosePayrollForm = () => {
    setShowPayrollForm(false);
    setEditingPayroll(null);
  };

  const handleDeleteEmployee = async (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    const employeeName = employee?.employee || employee?.name || 'this employee';
    
    if (window.confirm(`Are you sure you want to delete ${employeeName}?`)) {
      try {
        setLoading(true);
        await deleteData("employees", employeeId);
        loadEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
        alert("Error deleting employee. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get attendance status color
  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'Present': return '#4caf50';
      case 'Absent': return '#f44336';
      case 'Late': return '#ff9800';
      case 'Half Day': return '#9c27b0';
      case 'On Leave': return '#2196f3';
      case 'Sick Leave': return '#ff5722';
      default: return '#666';
    }
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? (employee.employee || employee.name) : 'Unknown Employee';
  };

  // Get payroll status color
  const getPayrollStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#ff9800';
      case 'Approved': return '#2196f3';
      case 'Paid': return '#4caf50';
      case 'Rejected': return '#f44336';
      case 'On Hold': return '#9c27b0';
      default: return '#666';
    }
  };

  // Load employees, attendance, and payroll on component mount
  useEffect(() => {
    loadEmployees();
    loadAttendance();
    loadPayroll();
  }, []);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <span>
          <HiOutlineCube />
        </span>
        <h4 style={{ margin: 0 }}>Poultry Management System</h4>
      </div>

      <h3>Employee Management</h3>

      <Tabs>
        <TabList>
          <Tab>Employee Directory</Tab>
          <Tab>Attendance</Tab>
          <Tab>Payroll</Tab>
        </TabList>

        <TabPanel>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h4 style={{ margin: 0 }}>Employee Directory</h4>
                <p style={{ color: "grey", margin: "5px 0 0 0" }}>Manage and update employee information</p>
              </div>
              <button 
                onClick={handleAddEmployee}
                style={{ 
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px"
                }}
              >
                <FiPlus size={16} />
                Add New Employee
              </button>
            </div>

            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px"
            }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
                  <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
              <input
                type="text"
                    placeholder="Search employees by name, ID, position, or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                      width: "100%",
                  height: "40px",
                  borderRadius: "10px",
                      border: "1px solid #ddd",
                      paddingLeft: "35px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    padding: "0 10px",
                    fontSize: "14px",
                    minWidth: "150px"
                  }}
                >
                  <option value="All">All Employees</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>

              {/* Employee Table */}
              {loading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  Loading employees...
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ 
                    width: "100%", 
                    borderCollapse: "collapse",
                    backgroundColor: "white",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8f9fa" }}>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Employee ID</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Employee</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Position</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Contact</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>CNIC</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Joining Date</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Salary</th>
                        <th style={{ padding: "15px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Status</th>
                        <th style={{ padding: "15px", textAlign: "center", borderBottom: "1px solid #ddd" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan="10" style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                            {employees.length === 0 ? "No employees found. Add your first employee!" : "No employees match your search."}
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <tr key={employee.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "15px" }}>
                              <strong>{employee.employeeId}</strong>
                            </td>
                            <td style={{ padding: "15px" }}>
                              <strong>{employee.employee || employee.name}</strong>
                            </td>
                            <td style={{ padding: "15px" }}>
                              <span style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                backgroundColor: (employee.position || employee.role) === "Manager" ? "#e3f2fd" : "#f3e5f5",
                                color: (employee.position || employee.role) === "Manager" ? "#1976d2" : "#7b1fa2"
                              }}>
                                {employee.position || employee.role}
                              </span>
                            </td>
                            <td style={{ padding: "15px" }}>{employee.contact || employee.phone}</td>
                            <td style={{ padding: "15px" }}>{employee.cnic || '-'}</td>
                            <td style={{ padding: "15px" }}>{formatDate(employee.joiningDate || employee.joinDate)}</td>
                            <td style={{ padding: "15px" }}>{formatCurrency(employee.salary)}</td>
                            <td style={{ padding: "15px" }}>
                              <span style={{
                                padding: "4px 8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                backgroundColor: (employee.status || 'Active') === "Active" ? "#e8f5e8" : "#ffebee",
                                color: (employee.status || 'Active') === "Active" ? "#2e7d32" : "#c62828"
                              }}>
                                {employee.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: "15px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                <button
                                  onClick={() => handleEditEmployee(employee)}
                                  style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px"
                                  }}
                                >
                                  <FiEdit size={12} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px"
                                  }}
                                >
                                  <FiTrash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h4 style={{ margin: 0 }}>Employee Attendance</h4>
                <p style={{ color: "grey", margin: "5px 0 0 0" }}>Track employee attendance and working hours</p>
              </div>
              <button
                onClick={handleAddAttendance}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px"
                }}
              >
                <FiPlus size={16} />
                Add Attendance
              </button>
            </div>

            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px"
            }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
                  <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                  <input
                    type="text"
                    placeholder="Search by employee name or position..."
                    value={attendanceSearchTerm}
                    onChange={(e) => setAttendanceSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      paddingLeft: "35px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <input
                  type="date"
                  value={attendanceDateFilter}
                  onChange={(e) => setAttendanceDateFilter(e.target.value)}
                  style={{
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    padding: "0 10px",
                    fontSize: "14px"
                  }}
                />

                <select
                  value={attendanceStatusFilter}
                  onChange={(e) => setAttendanceStatusFilter(e.target.value)}
                  style={{
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    padding: "0 10px",
                    fontSize: "14px",
                    minWidth: "150px"
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Half Day">Half Day</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p>Loading attendance...</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8f9fa" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Employee</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Date</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Status</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Check-in</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Check-out</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Work Hours</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAttendance.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                            {attendance.length === 0 ? "No attendance records found. Add your first attendance record!" : "No attendance records match your search criteria."}
                          </td>
                        </tr>
                      ) : (
                        filteredAttendance.map((record) => (
                          <tr key={record.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{getEmployeeName(record.employee)}</td>
                            <td style={{ padding: "12px" }}>{formatDate(record.date)}</td>
                            <td style={{ padding: "12px" }}>
                              <span
                                style={{
                                  backgroundColor: getAttendanceStatusColor(record.status),
                                  color: "white",
                                  padding: "4px 8px",
                                  borderRadius: "12px",
                                  fontSize: "12px",
                                  fontWeight: "500"
                                }}
                              >
                                {record.status}
                              </span>
                            </td>
                            <td style={{ padding: "12px" }}>{record.checkin || '-'}</td>
                            <td style={{ padding: "12px" }}>{record.checkout || '-'}</td>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{record.workHours ? `${record.workHours}h` : '-'}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                <button
                                  onClick={() => handleEditAttendance(record)}
                                  style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px"
                                  }}
                                >
                                  <FiEdit size={12} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAttendance(record.id)}
                                  style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px"
                                  }}
                                >
                                  <FiTrash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <div>
                <h4 style={{ margin: 0 }}>Employee Payroll</h4>
                <p style={{ color: "grey", margin: "5px 0 0 0" }}>Manage employee salaries and payments</p>
              </div>
              <button
                onClick={handleAddPayroll}
                style={{
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px"
                }}
              >
                <FiPlus size={16} />
                Add Payroll
              </button>
            </div>

            <div style={{
              backgroundColor: "whitesmoke",
              borderRadius: "10px",
              padding: "20px"
            }}>
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flex: "1", minWidth: "300px" }}>
                  <FiSearch style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                  <input
                    type="text"
                    placeholder="Search by employee name, position..."
                    value={payrollSearchTerm}
                    onChange={(e) => setPayrollSearchTerm(e.target.value)}
                    style={{
                      width: "100%",
                      height: "40px",
                      borderRadius: "10px",
                      border: "1px solid #ddd",
                      paddingLeft: "35px",
                      fontSize: "14px"
                    }}
                  />
                </div>

                <select
                  value={payrollStatusFilter}
                  onChange={(e) => setPayrollStatusFilter(e.target.value)}
                  style={{
                    height: "40px",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                    padding: "0 10px",
                    fontSize: "14px",
                    minWidth: "150px"
                  }}
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Paid">Paid</option>
                  <option value="Rejected">Rejected</option>
                  <option value="On Hold">On Hold</option>
                </select>
              </div>

              {loading ? (
                <div style={{ textAlign: "center", padding: "40px" }}>
                  <p>Loading payroll...</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "white", borderRadius: "8px", overflow: "hidden" }}>
                    <thead>
                      <tr style={{ backgroundColor: "#f8f9fa" }}>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Employee</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Salary Month</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Amount</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Payment Method</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Payment Date</th>
                        <th style={{ padding: "12px", textAlign: "left", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Invoice ID</th>
                        <th style={{ padding: "12px", textAlign: "center", borderBottom: "1px solid #dee2e6", fontWeight: "600" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPayroll.length === 0 ? (
                        <tr>
                          <td colSpan="7" style={{ padding: "40px", textAlign: "center", color: "#666" }}>
                            {payroll.length === 0 ? "No payroll records found. Add your first payroll record!" : "No payroll records match your search criteria."}
                          </td>
                        </tr>
                      ) : (
                        filteredPayroll.map((record) => (
                          <tr key={record.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                            <td style={{ padding: "12px", fontWeight: "500" }}>{record.employeeName || getEmployeeName(record.employeeId || record.employee)}</td>
                            <td style={{ padding: "12px" }}>{record.salaryMonth || "N/A"}</td>
                            <td style={{ padding: "12px", fontWeight: "bold", color: "#007bff" }}>{formatCurrency(record.amount || 0)}</td>
                            <td style={{ padding: "12px" }}>{record.paymentMethod || "N/A"}</td>
                            <td style={{ padding: "12px" }}>{formatDate(record.paymentDate)}</td>
                            <td style={{ padding: "12px", color: "#666", fontSize: "12px" }}>{record.invoiceId || "Not Generated"}</td>
                            <td style={{ padding: "12px", textAlign: "center" }}>
                              <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                                <button
                                  onClick={() => handleEditPayroll(record)}
                                  style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px"
                                  }}
                                >
                                  <FiEdit size={12} />
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeletePayroll(record.id)}
                                  style={{
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    padding: "6px 10px",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                    fontSize: "12px"
                                  }}
                                >
                                  <FiTrash2 size={12} />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </TabPanel>
      </Tabs>

      {showForm && (
        <EmployeeForm
          employeeId={editingEmployee}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {showAttendanceForm && (
        <EmployeeAttendanceForm
          attendanceId={editingAttendance}
          onClose={handleCloseAttendanceForm}
          onSuccess={handleAttendanceFormSuccess}
        />
      )}

      {showPayrollForm && (
        <EmployeePaymentForm
          payrollId={editingPayroll}
          onClose={handleClosePayrollForm}
          onSuccess={handlePayrollFormSuccess}
        />
      )}
    </>
  );
}

export default Employee;