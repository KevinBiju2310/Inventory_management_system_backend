const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const customerModel = mongoose.model("customer", customerSchema);
module.exports = customerModel;
