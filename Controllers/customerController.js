const customerModel = require("../Models/customerSchema");
const STATUS = require("../utils/statusCodes");
const MESSAGES = require("../utils/messages");

const addCustomer = async (req, res) => {
  try {
    const { name, address, mobileNumber } = req.body;
    const userId = req.user.id;
    const existingName = await customerModel.findOne({ name });
    if (existingName) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.CUSTOMER_EXISTS });
    }
    const newCustomer = new customerModel({
      userId,
      name,
      address,
      mobileNumber,
    });
    await newCustomer.save();
    res
      .status(STATUS.OK)
      .json({ message: MESSAGES.CUSTOMER_ADDED, newCustomer });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const allCustomers = async (req, res) => {
  try {
    const userId = req.user.id;
    const customers = await customerModel.find({ userId });
    res
      .status(STATUS.OK)
      .json({ message: MESSAGES.CUSTOMERS_RETRIEVED, customers });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  addCustomer,
  allCustomers,
};
