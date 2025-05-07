import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNavbar from "./components/AdminNavbar";

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [proposedDates, setProposedDates] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://consultancy-yrz7.onrender.com/api/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const handleAccept = async (orderId) => {
    const dates = proposedDates[orderId];
    if (!dates || dates.length !== 3) {
      return alert("Please provide exactly 3 proposed meet dates.");
    }

    try {
      const res = await axios.put(`https://consultancy-yrz7.onrender.com/api/orders/${orderId}/accept`, {
        proposedMeetDates: dates,
      });
      setMessage(res.data.message);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage("Error accepting order.");
    }
  };

  const handleReject = async (orderId) => {
    try {
      const res = await axios.put(`https://consultancy-yrz7.onrender.com/api/orders/${orderId}/reject`);
      setMessage(res.data.message);
      fetchOrders();
    } catch (err) {
      console.error(err);
      setMessage("Error rejecting order.");
    }
  };

  const handleDateChange = (orderId, index, value) => {
    setProposedDates((prev) => {
      const newDates = [...(prev[orderId] || [])];
      newDates[index] = value;
      return { ...prev, [orderId]: newDates };
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>
        {message && <div className="mb-4 text-blue-600">{message}</div>}
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-4 rounded shadow">
              <p><strong>User:</strong> {order.userId}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>

              <div className="mt-2">
                <strong>Items:</strong>
                <ul className="list-disc list-inside">
                  {order.items.map((item, idx) => (
                    <li key={idx}>{item.name} - {item.quantity}kg @ ₹{item.pricePerKg}/kg</li>
                  ))}
                </ul>
              </div>

              {order.status === "Pending" && (
                <div className="mt-4">
                  <label className="block font-semibold">Propose 3 Meet Dates:</label>
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      type="date"
                      className="border px-2 py-1 mt-1 mr-2"
                      onChange={(e) => handleDateChange(order._id, i, e.target.value)}
                    />
                  ))}
                  <div className="mt-2 space-x-2">
                    <button
                      onClick={() => handleAccept(order._id)}
                      className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(order._id)}
                      className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {order.status === "Accepted" && order.proposedMeetDates?.length > 0 && (
                <div className="mt-2">
                  <strong>Proposed Meet Dates:</strong>
                  <ul className="list-disc list-inside">
                    {order.proposedMeetDates.map((date, index) => (
                      <li key={index}>{new Date(date).toLocaleDateString()}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ManageOrder;
