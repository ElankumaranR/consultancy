import React from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaFilter, FaSort } from "react-icons/fa";

const products = [
  { id: 1, name: "High-Quality Iron Rod", price: 3500, image: "https://blog.naijaspider.com/wp-content/uploads/2024/09/rebar.webp" },
  { id: 2, name: "Premium Steel Sheet", price: 5200, image: "https://blog.naijaspider.com/wp-content/uploads/2024/09/rebar.webp" },
  { id: 3, name: "Durable Metal Pipe", price: 4100, image: "https://blog.naijaspider.com/wp-content/uploads/2024/09/rebar.webp" },
  { id: 4, name: "Heavy-Duty Bolts & Nuts", price: 1200, image: "https://blog.naijaspider.com/wp-content/uploads/2024/09/rebar.webp" },
];

const Shop = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      {/* Header */}
      <header className="py-6 text-center bg-gray-900 text-white">
        <h1 className="text-4xl font-bold">Shop Premium Steel & Iron Products</h1>
        <p className="mt-2 opacity-75">Browse our collection of high-quality construction materials.</p>
      </header>

      {/* Filters & Sorting */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded">
          <FaFilter /> Filter
        </button>
        <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded">
          <FaSort /> Sort
        </button>
      </div>

      {/* Product Listing */}
      <section className="py-10 px-6 max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="p-6 bg-white rounded-lg shadow-lg text-center">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-xl font-semibold mt-4">{product.name}</h3>
            <p className="text-xl font-bold mt-2">₹{product.price} / unit</p>
            <button
              className="mt-4 bg-blue-600 hover:bg-blue-500 transition px-6 py-2 text-white font-semibold rounded-lg"
            >
              <FaShoppingCart className="inline mr-2" /> Add to Cart
            </button>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-red-600 text-white text-center">
        <h2 className="text-3xl font-bold">Need Bulk Orders?</h2>
        <p className="mt-3 opacity-90">Contact us for wholesale pricing and customized solutions.</p>
        <button
          className="mt-6 bg-white text-red-600 hover:bg-gray-200 transition px-6 py-3 text-lg font-semibold rounded-lg"
          onClick={() => navigate("/contact")}
        >
          Contact Us
        </button>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-gray-900 text-white">
        <p>&copy; 2025 IronTech E-Commerce. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Shop;
