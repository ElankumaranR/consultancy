const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");
const Item = require("../models/Item");
const Order = require("../models/Order");

router.post("/create", async (req, res) => {
  const { userId } = req.body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userCart = await Cart.findOne({ userId }).session(session);

    if (!userCart || userCart.items.length === 0) {
      await session.abortTransaction();
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Check availability for all items first
    for (const cartItem of userCart.items) {
      const dbItem = await Item.findById(cartItem.itemId).session(session);
      if (!dbItem) {
        await session.abortTransaction();
        return res.status(404).json({ message: `Item not found: ${cartItem.itemId}` });
      }

      if (cartItem.quantity > dbItem.availability) {
        await session.abortTransaction();
        return res.status(400).json({
          message: `Out of stock: ${dbItem.name}, Available: ${dbItem.availability}, Requested: ${cartItem.quantity}`,
        });
      }
    }

    // Deduct stock
    for (const cartItem of userCart.items) {
      await Item.findByIdAndUpdate(
        cartItem.itemId,
        { $inc: { availability: -cartItem.quantity } },
        { session }
      );
    }

    // Calculate total
    const totalAmount = userCart.items.reduce((total, item) => {
      return total + item.quantity * item.pricePerKg;
    }, 0);

    // Create order
    const newOrder = new Order({
      userId,
      items: userCart.items,
      totalAmount,
    });

    await newOrder.save({ session });

    // Clear cart
    await Cart.findOneAndUpdate({ userId }, { items: [] }, { session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error("Transaction failed:", error);
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
  
      // Reassign item quantities to availability
      for (const item of order.items) {
        await Item.findByIdAndUpdate(item.itemId, {
          $inc: { availability: item.quantity }
        });
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
  // Retieve yr for histogram
  router.get("/sales/:year", async (req, res) => {
    const year = parseInt(req.params.year);
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year + 1}-01-01`);
  
    try {
      const orders = await Order.aggregate([
        {
          $match: {
            status: "Accepted",
            orderDate: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: { $month: "$orderDate" },
            totalSales: { $sum: "$totalAmount" },
          },
        },
        {
          $project: {
            month: "$_id",
            totalSales: 1,
            _id: 0,
          },
        },
        { $sort: { month: 1 } },
      ]);
  
      res.json(orders);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch sales data" });
    }
  });
  //Analytics fr admin components
  router.get("/analytics/:year", async (req, res) => {
    const { year } = req.params;
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${parseInt(year) + 1}-01-01`);
  
    try {
      const orders = await Order.find({
        orderDate: { $gte: start, $lt: end },
        status: "Accepted",
      });
  
      // Monthly revenue calculation
      const monthlySales = Array(12).fill(0);
      let totalRevenue = 0;
      let totalOrders = 0;
      const categorySales = {};
  
      for (const order of orders) {
        const month = new Date(order.orderDate).getMonth();
        monthlySales[month] += order.totalAmount;
        totalRevenue += order.totalAmount;
        totalOrders += 1;
  
        for (const item of order.items) {
          categorySales[item.category] = (categorySales[item.category] || 0) + item.quantity;
        }
      }
  
      res.json({
        monthlySales,
        totalRevenue,
        totalOrders,
        categorySales,
      });
    } catch (err) {
      res.status(500).json({ error: "Analytics fetch failed" });
    }
  });
  
  
  router.put("/:id/reject", async (req, res) => {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: "Order not found" });
  
      if (order.status !== "Pending") {
        return res.status(400).json({ error: "Only pending orders can be rejected" });
      }
  
      // Reassign item quantities to availability
      for (const item of order.items) {
        await Item.findByIdAndUpdate(item.itemId, {
          $inc: { availability: item.quantity }
        });
      }
  
      order.status = "Rejected";
      order.statusUpdatedAt = new Date();
      await order.save();
  
      res.json({ message: "Order rejected", order });
    } catch (err) {
      console.error("Error rejecting order:", err);
      res.status(500).json({ error: "Error rejecting order" });
    }
  });
  router.get("/", async (req, res) => {
    try {
      const orders = await Order.find(); // if items have a reference to Item model
  
      res.status(200).json(orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      res.status(500).json({ error: "Server error fetching orders" });
    }
  });
module.exports = router;
