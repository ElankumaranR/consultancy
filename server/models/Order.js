const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      itemId: String,
      name: String,
      quantity: Number,
      pricePerKg: Number,
      category: String,
      image: String,
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected", "Cancelled"],
    default: "Pending",
  },
  statusUpdatedAt: {
    type: Date,
    default: Date.now,
  },
  cancellationDate: {
    type: Date,
    default: null,
  },

  // Removed strict validation
  proposedMeetDates: {
    type: [Date],
    default: [],
  },
  selectedMeetDate: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Order", orderSchema);
