const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Add or Update Item in Cart
router.post("/add-to-cart", async (req, res) => {
  const { userId, item } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [item] });
    } else {
      const existingItem = cart.items.find(i => i.itemId === item.itemId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.items.push(item);
      }
    }

    await cart.save();
    res.status(200).json(cart.items);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Failed to add item to cart." });
  }
});

// Get User Cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart ? cart.items : []);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Failed to fetch cart." });
  }
});

// Update Item Quantity
router.put("/update-item", async (req, res) => {
  const { userId, itemId, quantity} = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found." });

    const item = cart.items.find(i => i.itemId === itemId);
    if (item) {
      item.quantity = quantity;
      await cart.save();
      res.status(200).json(cart.items);
    } else {
      res.status(404).json({ message: "Item not found in cart." });
    }
  } catch (error) {
    console.error("Update item error:", error);
    res.status(500).json({ message: "Failed to update item." });
  }
});

// Remove Item from Cart
router.delete("/remove-item", async (req, res) => {
  const { userId, itemId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) return res.status(404).json({ message: "Cart not found." });

    cart.items = cart.items.filter(i => i.itemId !== itemId);
    await cart.save();

    res.status(200).json(cart.items);
  } catch (error) {
    console.error("Remove item error:", error);
    res.status(500).json({ message: "Failed to remove item."+error.message});
  }
});

module.exports = router;
