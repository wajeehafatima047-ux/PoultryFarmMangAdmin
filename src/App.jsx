import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/sidebar";

import Login from "./pages/Login";
import Home from "./pages/Home";

import Signup from "./pages/Signup";

import Setting from "./pages/Setting";


// Feed Management
import FeedPurchase from "./pages/FeedPurchase";
import FeedUsage from "./pages/FeedUsage";
import FeedInventory from "./pages/FeedInventory";

// Medicine Management
import MedicinePurchase from "./pages/MedicinePurchase";
import MedicineUsage from "./pages/MedicineUsage";
import MedicineInventory from "./pages/MedicineInventory";

// Chicken Management
import PurchaseChicken from "./pages/PurchaseChicken";
import ChickenInventory from "./pages/ChickenInventory";
import Orders from "./pages/Orders";
import DailyChickenRate from "./pages/DailyChickenRate";

// Invoice Management
import Invoices from "./pages/Invoices";

// Employee Management
import Employee from "./pages/Employee";

export default function App() {
  // get user from redux store
  const user = useSelector((state) => state.home.user);

  return (
    <BrowserRouter>
      {user?.uid ? (
        <div style={{ display: "flex", height: "100vh" }}>
          <Sidebar />
          <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Setting" element={<Setting />} />
              
              {/* Employee Management */}
              <Route path="/Employee" element={<Employee />} />
              
              {/* Feed Management Routes */}
              <Route path="/FeedPurchase" element={<FeedPurchase />} />
              <Route path="/FeedUsage" element={<FeedUsage />} />
              <Route path="/FeedInventory" element={<FeedInventory />} />
              
              {/* Medicine Management Routes */}
              <Route path="/MedicinePurchase" element={<MedicinePurchase />} />
              <Route path="/MedicineUsage" element={<MedicineUsage />} />
              <Route path="/MedicineInventory" element={<MedicineInventory />} />
              
              {/* Chicken Management Routes */}
              <Route path="/PurchaseChicken" element={<PurchaseChicken />} />
              <Route path="/ChickenInventory" element={<ChickenInventory />} />
              <Route path="/Orders" element={<Orders />} />
              <Route path="/DailyChickenRate" element={<DailyChickenRate />} />
              
              {/* Invoice Management */}
              <Route path="/Invoices" element={<Invoices />} />
              
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}
// if(x==2){
//   console.log("x is even");

// } else {
//   console.log("x is even");

// }

// ternary operatory

// x ==2 ? console.log("x is even") : console.log("x is odd ");
