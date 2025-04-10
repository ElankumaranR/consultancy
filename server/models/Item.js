const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
  category: { type: String },
  weightPerBar: { type: Number, required: true },  // in Kg
  length: { type: Number, default: 12 },           // in meters, optional
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
module.exports = Item;
