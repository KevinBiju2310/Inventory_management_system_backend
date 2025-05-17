const saleModel = require("../Models/saleSchema");
const itemModel = require("../Models/itemSchema");
const customerModel = require("../Models/customerSchema");
const STATUS = require("../utils/statusCodes");
const MESSAGES = require("../utils/messages");

const parseDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const makeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { customerId, items, totalAmount } = req.body;
    const customer = await customerModel.findById(customerId);
    if (!customer) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: MESSAGES.CUSTOMER_NOT_FOUND });
    }
    const itemIds = items.map((item) => item.itemId);
    const validItems = await itemModel.find({ _id: { $in: itemIds } });
    if (validItems.length !== items.length) {
      return res.status(400).json({ message: "One or more items are invalid" });
    }
    for (const orderItem of items) {
      const item = validItems.find(
        (i) => i._id.toString() === orderItem.itemId
      );
      if (!item) {
        return res
          .status(STATUS.NOT_FOUND)
          .json({ message: MESSAGES.ITEM_NOT_FOUND });
      }
      if (item.quantity < orderItem.quantity) {
        return res
          .status(STATUS.BAD_REQUEST)
          .json({ message: MESSAGES.INSUFFICIENT_STOCK(item.name) });
      }
    }
    for (const orderItem of items) {
      await itemModel.findByIdAndUpdate(orderItem.itemId, {
        $inc: { quantity: -orderItem.quantity },
      });
    }
    const sale = new saleModel({
      userId,
      customer: customerId,
      items,
      total: totalAmount,
    });
    await sale.save();
    res.status(STATUS.CREATED).json({ message: MESSAGES.ORDER_SUCCESS, sale });
  } catch (error) {
    console.error("Error Occured", error);
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const allOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const sales = await saleModel
      .find({ userId })
      .populate("customer")
      .populate("items.itemId")
      .sort({ createdAt: -1 });
    res.status(STATUS.OK).json({ sales });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const fetchReport = async (req, res) => {
  try {
    const { reportType } = req.params;
    const { startDate, endDate, customerName } = req.query;
    const userId = req.user.id;
    const { start, end } = parseDateRange(startDate, endDate);
    switch (reportType) {
      case "sales":
        const sales = await saleModel
          .find({
            userId,
            date: { $gte: start, $lte: end },
          })
          .populate("customer")
          .populate("items.itemId");
        return res.status(STATUS.OK).json({ sales });

      case "customerLedger":
        if (!customerName) {
          return res
            .status(STATUS.BAD_REQUEST)
            .json({ message: MESSAGES.CUSTOMER_NAME_REQUIRED });
        }
        const customer = await customerModel.findOne({ name: customerName });
        if (!customer) {
          return res
            .status(STATUS.NOT_FOUND)
            .json({ message: MESSAGES.CUSTOMER_NOT_FOUND });
        }
        const customerLedger = await saleModel
          .find({
            userId,
            customer: customer._id,
          })
          .populate("items.itemId");

        return res.status(STATUS.OK).json({ customerLedger });
    }
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  makeOrder,
  allOrders,
  fetchReport,
};
