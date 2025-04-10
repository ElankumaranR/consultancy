import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // correct path

const Navbar = () => {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout(); // ✅ logout is a function from context
      console.log("User logged out");
    navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <div className="text-xl font-bold">Steel Admin Panel</div>
      <ul className="flex space-x-6">
        <li>
          <Link to="/calculator" className="hover:text-yellow-400">
            Calculator
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:text-yellow-400">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/orders" className="hover:text-yellow-400">
            Orders
          </Link>
        </li>
        <li>
          <Link to="/Product" className="hover:text-yellow-400">
            Products
          </Link>
        </li>
        <li>
          <button
  onClick={handleLogout}
  className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
>
  Logout
</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
