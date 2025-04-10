import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./components/AdminNavbar";

const ManageProduct = () => {
  const [items, setItems] = useState([]);
  const [item, setItem] = useState({
    name: "",
    pricePerKg: "",
    weightPerBar: "",
    length: "",
    description: "",
    category: "",
    image: "",
  });
  const [editItemId, setEditItemId] = useState(null);

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItemId) {
        await axios.put(`http://localhost:5000/admin/update-item/${editItemId}`, item);
        setEditItemId(null);
      } else {
        await axios.post("http://localhost:5000/admin/add-item", item);
      }
      setItem({
        name: "",
        pricePerKg: "",
        weightPerBar: "",
        length: "",
        description: "",
        category: "",
        image: "",
      });
      fetchItems();
    } catch (err) {
      console.error("Error saving item:", err);
    }
  };

  const handleEdit = (item) => {
    setItem(item);
    setEditItemId(item._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`http://localhost:5000/admin/delete-item/${id}`);
        fetchItems();
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <>
      <AdminNavbar />

      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{editItemId ? "Edit Item" : "Add New Item"}</h2>

        <form onSubmit={handleSubmit} className="grid gap-4 bg-gray-50 p-4 rounded-lg shadow">
          <input
            type="text"
            name="name"
            placeholder="Item Name"
            value={item.name}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="pricePerKg"
            placeholder="Price per Kg"
            value={item.pricePerKg}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="weightPerBar"
            placeholder="Weight per Bar (kg)"
            value={item.weightPerBar}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="number"
            name="length"
            placeholder="Length (m)"
            value={item.length}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={item.category}
            onChange={handleChange}
            className="p-2 border rounded"
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={item.description}
            onChange={handleChange}
            className="p-2 border rounded"
            rows={3}
          />
          <input
            type="text"
            name="image"
            placeholder="Image URL"
            value={item.image}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            {editItemId ? "Update Item" : "Add Item"}
          </button>
        </form>

        <h2 className="text-xl font-semibold mt-8 mb-4">Items List</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((it) => (
            <div key={it._id} className="bg-white border rounded-lg shadow p-4">
              {it.image && (
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-bold">{it.name}</h3>
              <p className="text-sm text-gray-600">{it.description}</p>
              <p className="mt-1">Price: ₹{it.pricePerKg} / Kg</p>
              <p>Weight per Bar: {it.weightPerBar} Kg</p>
              <p>Length: {it.length || "12"} m</p>
              <p className="text-xs text-gray-500">Category: {it.category}</p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(it)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(it._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ManageProduct;
