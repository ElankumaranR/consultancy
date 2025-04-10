const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const Order = require("../models/Order");

// Add item
router.post("/add-item", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to add item." });
  }
});

// Get all items
router.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items." });
  }
});

// Update item
router.put("/update-item/:id", async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: "Failed to update item." });
  }
});

// Delete item
router.delete("/delete-item/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item." });
  }
});

module.exports = router;

