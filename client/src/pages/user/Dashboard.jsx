import React from "react";
import { useNavigate } from "react-router-dom";
import { FaTruck, FaShieldAlt, FaIndustry, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();

  return (
    <><Navbar/>
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Hero Section */}
      <header
        className="relative w-full h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{
            backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYYOCU8glOWOnhPdi4Z9CpDMJJOM6N3Xpi9g&s')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "80vh"
          }}        >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-10 text-center px-6 text-white">
          <h1 className="text-5xl font-bold uppercase">Premium Iron Rods & Steel Products</h1>
          <p className="mt-4 text-lg">Top-quality construction materials for your next project.</p>
          <button
            className="mt-6 bg-red-600 hover:bg-red-500 transition px-6 py-3 text-lg font-semibold rounded-lg shadow-lg"
            onClick={() => navigate("/Product")}
          >
            Shop Now
          </button>
        </div>
      </header>

      {/* Featured Products */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((id) => (
            <div key={id} className="p-6 bg-white rounded-lg shadow-lg text-center">
              <img
                src={`https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg`}
                alt="Iron Rod"
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-4">High-Quality Iron Rod</h3>
              <p className="opacity-75">Durable and rust-resistant steel rods for heavy-duty use.</p>
              <p className="text-xl font-bold mt-2">₹3,500 / ton</p>
              <button
                className="mt-4 bg-blue-600 hover:bg-blue-500 transition px-6 py-2 text-white font-semibold rounded-lg"
              >
                <FaShoppingCart className="inline mr-2" /> Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {['Iron Rods', 'Steel Sheets', 'Pipes', 'Nuts & Bolts'].map((category, index) => (
            <div key={index} className="p-6 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition">
              <h3 className="text-xl font-semibold">{category}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us? */}
      <section className="py-16 bg-gray-800 text-white text-center">
        <h2 className="text-3xl font-bold">Why Buy From Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 px-6 max-w-6xl mx-auto">
          <div className="p-6 bg-gray-700 rounded-lg">
            <FaShieldAlt className="text-4xl mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold">Certified Quality</h3>
            <p>All products meet industry standards and certifications.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg">
            <FaTruck className="text-4xl mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold">Fast Delivery</h3>
            <p>Nationwide shipping with same-day dispatch.</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg">
            <FaCheckCircle className="text-4xl mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-semibold">Secure Payments</h3>
            <p>Safe and easy transactions with multiple payment options.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-red-600 text-white text-center">
        <h2 className="text-3xl font-bold">Ready to Build with the Best?</h2>
        <p className="mt-3 opacity-90">Order high-quality construction materials at unbeatable prices.</p>
        <button
          className="mt-6 bg-white text-red-600 hover:bg-gray-200 transition px-6 py-3 text-lg font-semibold rounded-lg"
          onClick={() => navigate("/Product")}
        >
          Start Shopping
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-gray-900 text-white">
        <p>&copy; 2025 IronTech E-Commerce. All rights reserved.</p>
      </footer>
    </div>
    </>
  );
};

export default Home;
