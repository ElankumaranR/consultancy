import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Menu, X } from "lucide-react"; // Optional: install `lucide-react` or use any icon set

const Navbar = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      console.log("User logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="text-xl font-bold">SR STEELS</div>

        {/* Hamburger button */}
        <button
          className="md:hidden focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop menu */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/calculator" className="hover:text-yellow-400">
              Calculator
            </Link>
          </li>
          <li>
            <Link to="/" className="hover:text-yellow-400">
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
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col space-y-4">
          <li>
            <Link to="/calculator" onClick={toggleMenu} className="hover:text-yellow-400">
              Calculator
            </Link>
          </li>
          <li>
            <Link to="/" onClick={toggleMenu} className="hover:text-yellow-400">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/orders" onClick={toggleMenu} className="hover:text-yellow-400">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/Product" onClick={toggleMenu} className="hover:text-yellow-400">
              Products
            </Link>
          </li>
          <li>
            <button
              onClick={() => {
                toggleMenu();
                handleLogout();
              }}
              className="text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
