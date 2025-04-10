import React, { useEffect, useState } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
const Order = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const userId = user.uid; // Or use context/auth hook
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/user/${userId}`);
      // Safely set orders
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      } else {
        setOrders([]); // fallback if unexpected format
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]); // fallback to avoid crash
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`);
      setMessage(res.data.message);
      fetchOrders(); // Refresh orders
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Cancellation failed");
    }
  };

  const isCancellable = (order) => {
    const placed = new Date(order.orderDate);
    const now = new Date();
    const diff = (now - placed) / (1000 * 60 * 60 * 24);
    return diff <= 3 && order.status === "Pending";
  };

  return (
    <>
    <Navbar/>
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Orders</h2>
      {message && <div className="mb-4 text-blue-600">{message}</div>}
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="border p-4 mb-4 rounded shadow">
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ₹{order.totalAmount}</p>

            {order.proposedMeetDates?.length > 0 && (
              <div className="mt-2">
                <strong>Proposed Meet Dates:</strong>
                <ul className="list-disc list-inside">
                  {order.proposedMeetDates.map((date, index) => (
                    <li key={index}>{new Date(date).toLocaleDateString()}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-2">
              <strong>Items:</strong>
              <ul className="list-disc list-inside">
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} kg @ ₹{item.pricePerKg}/kg
                  </li>
                ))}
              </ul>
            </div>

            {isCancellable(order) && (
              <button
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={() => handleCancel(order._id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
    </>
  );
};

export default Order;
