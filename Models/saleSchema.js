const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
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
      required: true,
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "item",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    total: {
      type: Number,
    },
    paymentType: {
      type: String,
      enum: ["cash"],
      default: "cash",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const saleModel = mongoose.model("sale", saleSchema);
module.exports = saleModel;
