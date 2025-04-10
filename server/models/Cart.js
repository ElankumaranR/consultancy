const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  pricePerKg: Number,
  quantity: Number,
  category: String,
  image: String,
});

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  items: [cartItemSchema],
});

module.exports = mongoose.model("Cart", cartSchema);
