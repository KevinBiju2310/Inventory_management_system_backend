const customerModel = require("../Models/customerSchema");

const addCustomer = async (req, res) => {
  try {
    const { name, address, mobileNumber } = req.body;
    const userId = req.user.id;
    const existingName = await customerModel.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: "Customer already exists" });
    }
    const newCustomer = new customerModel({
      userId,
      name,
      address,
      mobileNumber,
    });
    await newCustomer.save();
    res
      .status(201)
      .json({ message: "Customer added successfully", newCustomer });
  } catch (error) {
    res.status(500).json({ message: "Internet Server Error" });
  }
};

const allCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    const customers = await customerModel.find({ userId });
    res
      .status(200)
      .json({ message: "Customers retrieved successfully", customers });
  } catch (error) {
    res.status(500).json({ message: "Internet Server Error" });
  }
};

module.exports = {
  addCustomer,
  allCustomers,
};
