// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./components/sidebar";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Orders from "./pages/orders";

// import Signup from "./pages/Signup";

// import Financials from "./pages/Financials";
// import Setting from "./pages/Setting";
// import ChickenSales from "./pages/ChickenSales";

// import Inventory from "./pages/Inventory";
// import Payments from "./pages/Payments";
// import Employee from "./pages/Employee";

// const App = () => {
//   return (
//     <Router>
//       <div style={{ display: "flex" }}>
//         <Sidebar />
//         <div style={{ flex: 1, padding: "20px" }}>
//           <Routes>
//             <Route path="/" element={<Home />} />

//                  <Route path="/Signup" element={<Signup />} />
//             <Route path="/about" element={<Login />} />
//             <Route path="/Orders" element={<Orders />} />
//             <Route path="/Financials" element={<Financials />} />
//             <Route path="/Payments" element={<Payments />} />
//             <Route path="/Inventory" element={<Inventory />} />
//             <Route path="/Employee" element={<Employee />} />
//             <Route path="/ChickenSales" element={<ChickenSales />} />
//             <Route path="/Setting" element={<Setting />} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };

// const App = () => {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <RenderStack />
//         </PersistGate>
//       </Provider>
//     </SafeAreaView>
//   );
// };

// export default App;

// yusra

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route,Link} from 'react-router-dom';
// import Sidebar from './components/sidebar';
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Provider, useSelector } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";

// import { persistor, store } from "./redux/store";
// // import Sidebar from "./components/sidebar";
// import Login from "./pages/Login";
// import Home from "./pages/Home";
// import Orders from "./pages/orders";

// import Signup from "./pages/Signup";

// import Financials from "./pages/Financials";
// import Setting from "./pages/Setting";
// import ChickenSales from "./pages/ChickenSales";

// import Inventory from "./pages/Inventory";
// import Payments from "./pages/Payments";
// import Employee from "./pages/Employee";

// const Stack = createNativeStackNavigator();

// function RenderStack() {
//   const user = useSelector((state) => state.home.user);

//   if (!user?.uid) {
//     return (
//       <Stack.Navigator initialRouteName="SignUp">
//         <Stack.Screen name="SignUp" component={SignUp} />
//         {/* <Stack.Screen name="Verification" component={Verification} /> */}
//         <Stack.Screen name="Login" component={Login} />
//       </Stack.Navigator>
//     );
//   }

//   return (

//     <Router>

//       <div style={{ display: 'flex' }}>
//         <Sidebar />
//         <div style={{ flex: 1, padding: '20px' }}>
//           <Routes>
//             {/* <Route path="/SignUp" element={<SignUp/>} />*/}

//             <Route path="/" element={<Home />} />

// //                  <Route path="/Signup" element={<Signup />} />
// //             <Route path="/about" element={<Login />} />
// //             <Route path="/Orders" element={<Orders />} />
// //             <Route path="/Financials" element={<Financials />} />
// //             <Route path="/Payments" element={<Payments />} />
// //             <Route path="/Inventory" element={<Inventory />} />
// //             <Route path="/Employee" element={<Employee />} />
// //             <Route path="/ChickenSales" element={<ChickenSales />} />
// //             <Route path="/Setting" element={<Setting />} />

//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// };
// const App = () => {
//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <RenderStack />
//         </PersistGate>
//       </Provider>
//     </SafeAreaView>
//   );
// };

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./components/sidebar";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Orders from "./pages/Orders";

import Signup from "./pages/Signup";

import Financials from "./pages/Financials";
import Setting from "./pages/Setting";
import ChickenSales from "./pages/ChickenSales";

import Inventory from "./pages/Inventory";
import Payments from "./pages/Payments";
import Employee from "./pages/Employee";

import ChickenPurchaseForm from "./pages/ChickenPurchaseForm";

import EmployeeForm from "./pages/EmployeeForm";

// import EmployeePaymentForm from "./pages/EmployeePaymentForm "
//

import EmployeeAttendanceForm from "./pages/EmployeeAttendanceForm";
import EmployeePaymentForm from "./pages/EmployeePaymentForm";
export default function App() {
  // get user from redux store
  const user = useSelector((state) => state.home.user);

  return (
    <BrowserRouter>
      {user?.uid ? (
        <>
          <Sidebar />
          <Routes>
            {/* <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/Financials" element={<Financials />} />
            <Route path="/Payments" element={<Payments />} />
            <Route path="/Inventory" element={<Inventory />} />
            <Route path="/Employee" element={<Employee />} />
            <Route path="/ChickenSales" element={<ChickenSales />} />
            <Route path="/Setting" element={<Setting />} /> */}

            <Route
              path="/EmployeePaymentForm"
              element={<EmployeePaymentForm />}
            />

            <Route path="/EmployeeForm" element={<EmployeeForm />} />

            <Route
              path="/EmployeeAttendanceForm"
              element={<EmployeeAttendanceForm />}
            />

            <Route
              path="/ChickenPurchaseForm"
              element={<ChickenPurchaseForm />}
            />
          </Routes>
        </>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />

            <Route
              path="/ChickenPurchaseForm"
              element={<ChickenPurchaseForm />}
            />



          <Route path="/Signup" element={<Signup />} />

 




          




            <Route path="/" element={<Home />} />
            <Route path="/Orders" element={<Orders />} />
            <Route path="/Financials" element={<Financials />} />
            <Route path="/Payments" element={<Payments />} />
            <Route path="/Inventory" element={<Inventory />} />
            <Route path="/Employee" element={<Employee />} />
            <Route path="/ChickenSales" element={<ChickenSales />} />
            <Route path="/Setting" element={<Setting />} /> 
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
