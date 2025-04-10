const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Cart = require("../models/Cart");

// POST /api/orders/create
router.post("/create", async (req, res) => {
  const { userId } = req.body;

  try {
    // Fetch the user's cart
    const userCart = await Cart.findOne({ userId });

    if (!userCart || userCart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total amount
    const totalAmount = userCart.items.reduce((total, item) => {
      return total + item.quantity * item.pricePerKg;
    }, 0);

    // Create order
    const newOrder = new Order({
      userId,
      items: userCart.items,
      totalAmount,
    });

    await newOrder.save();

    // Clear the cart
    await Cart.findOneAndUpdate({ userId }, { items: [] });

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/user/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const orders = await Order.find({ userId }).sort({ orderDate: -1 });
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  
  // PUT: Cancel order (only within 3 days)
  router.put("/:id/cancel", async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      const now = new Date();
      const diffInMs = now - new Date(order.orderDate);
      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
      if (diffInDays > 3) {
        return res.status(400).json({ error: "Order can only be cancelled within 3 days" });
      }
  
      if (order.status !== "Pending") {
        return res.status(400).json({ error: "Only pending orders can be cancelled" });
      }
  
      order.status = "Cancelled";
      order.statusUpdatedAt = now;
      order.cancellationDate = now;
  
      await order.save();
      res.json({ message: "Order cancelled successfully", order });
    } catch (error) {
      console.error("Error cancelling order:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
  router.get("/", async (req, res) => {
    try {
      const orders = await Order.find().populate("userId", "email");
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Server error fetching orders" });
    }
  });
  
  // PUT: Accept an order with proposed dates
  router.put("/:id/accept", async (req, res) => {
    const { id } = req.params;
    const { proposedMeetDates } = req.body;
  
    if (!Array.isArray(proposedMeetDates) || proposedMeetDates.length !== 3) {
      return res.status(400).json({ error: "Exactly 3 proposed dates required" });
    }
  
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        {
          status: "Accepted",
          proposedMeetDates,
        },
        { new: true }
      );
      res.json({ message: "Order accepted with proposed dates", order });
    } catch (err) {
      res.status(500).json({ error: "Error updating order" });
    }
  });
  
  // PUT: Reject an order
  router.put("/:id/reject", async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findByIdAndUpdate(
        id,
        { status: "Rejected" },
        { new: true }
      );
      res.json({ message: "Order rejected", order });
    } catch (err) {
      res.status(500).json({ error: "Error rejecting order" });
    }
  });
module.exports = router;
