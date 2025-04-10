import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext"; // adjust path as needed

const AdminNavbar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ getting logout from context

  const handleLogout = async () => {
    try {
      await logout(); // ✅ call the logout function
      console.log("User logged out");
      navigate("/"); // redirect to login or home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Products", path: "/admin/products" },
    { name: "Orders", path: "/admin/orders" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold">Admin Panel</div>
        <div className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`hover:text-yellow-400 transition duration-200 ${
                pathname === item.path ? "text-yellow-400 font-semibold" : ""
              }`}
            >
              {item.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
