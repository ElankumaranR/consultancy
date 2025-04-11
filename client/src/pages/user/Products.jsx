import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import Navbar from "./Navbar";
const Product = () => {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [weightToAdd, setWeightToAdd] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showCart, setShowCart] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchItems();
    fetchCart();
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("http://localhost:5000/admin/items");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCart = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:5000/api/cart/${user.email}`);
      setCart(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleAddToCart = async (item) => {
    const userId = user.email;
    const quantity = parseFloat(weightToAdd[item._id]);

    if (!quantity || quantity <= 0) {
      alert("Please enter a valid quantity in Kg");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/cart/add-to-cart", {
        userId,
        item: {
          itemId: item._id,
          name: item.name,
          pricePerKg: item.pricePerKg,
          quantity,
          category: item.category,
          image: item.image,
        },
      });

      setWeightToAdd((prev) => ({ ...prev, [item._id]: "" }));
      fetchCart();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (!newQuantity || newQuantity <= 0) return;

    try {
      await axios.put("http://localhost:5000/api/cart/update-item", {
        userId: user.uid,
        itemId,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to update item quantity:", error);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete("http://localhost:5000/api/cart/remove-item", {
        data: { userId: user.uid, itemId },
      });
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const handleCheckout = async () => {
    const userId = user.email;
    const totalPrice = cart.reduce(
      (sum, item) => sum + item.quantity * item.pricePerKg,
      0
    );

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/orders/create", {
        userId,
        items: cart,
        totalPrice,
      });

      alert("✅ Order placed successfully!");
      fetchCart();
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Checkout failed. Please try again.");
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const uniqueCategories = [...new Set(items.map((i) => i.category))];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden">
      <h1 className="text-3xl font-bold text-center py-6 text-slate-800">🛒 Product Catalog</h1>

      {/* Toggle Cart Button (for small screens) */}
      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <button
          onClick={() => setShowCart(!showCart)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded shadow-md"
        >
          {showCart ? "Hide Cart" : "Show Cart"}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-6 px-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-64 md:w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded w-full sm:w-48 md:w-60 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="All">All Categories</option>
          {uniqueCategories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <div className="flex">
        {/* Product Grid */}
        <div className={`transition-all duration-500 px-4 md:px-20 flex-1 ${showCart && !isLargeScreen ? 'hidden' : 'block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
                <h2 className="text-xl font-semibold text-slate-800">{item.name}</h2>
                <p className="text-gray-600 mb-2">₹{item.pricePerKg} / Kg</p>
                <input
                  type="number"
                  placeholder="Weight in Kg"
                  min="1"
                  className="border rounded p-1 w-full mb-2"
                  value={weightToAdd[item._id] || ""}
                  onChange={(e) =>
                    setWeightToAdd({ ...weightToAdd, [item._id]: e.target.value })
                  }
                />
                <button
                  onClick={() => handleAddToCart(item)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded w-full"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Slide-In Cart */}
        <div
          className={`fixed lg:static top-0 right-0 h-full bg-white shadow-xl z-40 w-80 transition-transform duration-300 ${
            showCart || isLargeScreen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-6 overflow-y-auto h-full">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">🛍️ Your Cart</h2>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li key={item.itemId} className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-slate-700">{item.name}</span> -{" "}
                      <span>{item.quantity} Kg</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <input
                        type="number"
                        min="1"
                        className="border p-1 w-20"
                        value={item.quantity}
                        onChange={(e) =>
                          handleUpdateQuantity(item.itemId, parseFloat(e.target.value))
                        }
                      />
                      <button
                        onClick={() => handleRemoveItem(item.itemId)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Remove
                      </button>
                      <div className="text-green-600 font-medium text-sm">
                        ₹{item.quantity * item.pricePerKg}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {cart.length > 0 && (
              <div className="text-right mt-6">
                <button
                  onClick={handleCheckout}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded shadow"
                >
                  Checkout ₹
                  {cart.reduce((sum, item) => sum + item.quantity * item.pricePerKg, 0)}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Product;
