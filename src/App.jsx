import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Orders from "./pages/orders";

import Financials from "./pages/Financials";
import Setting from "./pages/Setting";
import ChickenSales from "./pages/ChickenSales";

import Inventory from "./pages/Inventory";
import Payments from "./pages/Payments";
import Employee from "./pages/Employee";

const App = () => {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<Login />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Financials" element={<Financials />} />
            <Route path="/Payments" element={<Payments />} />
            <Route path="/Inventory" element={<Inventory />} />
            <Route path="/Employee" element={<Employee />} />
            <Route path="/ChickenSales" element={<ChickenSales />} />
            <Route path="/Setting" element={<Setting />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
