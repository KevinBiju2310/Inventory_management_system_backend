const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
  },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: "item" },
      quantity: Number,
      price: Number,
    },
  ],
  total: {
    type: Number,
  },
  paymentType: {
    type: String,
    enum: ["cash"],
    required: true,
  },
});

const saleModel = mongoose.model("sale", saleSchema);
module.exports = saleModel;
