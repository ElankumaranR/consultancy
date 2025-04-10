import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/user/Dashboard.jsx"
import { AuthProvider } from "./context/AuthContext";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import ManageProduct from "./pages/admin/ManageProducts.jsx";
import ManageOrder from "./pages/admin/ManageOrders.jsx";
import Products from "./pages/user/Products.jsx";
import Orders from "./pages/user/Orders.jsx";
import Calci from "./pages/user/Calci.jsx";
const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Product" element={<Products />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<ManageProduct/>} />
          <Route path="/admin/orders" element={<ManageOrder />} />  
          <Route path="/orders" element={<Orders />} />       
          <Route path="/calculator" element={<Calci />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
