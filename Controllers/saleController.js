const saleModel = require("../Models/saleSchema");
const itemModel = require("../Models/itemSchema");
const customerModel = require("../Models/customerSchema");

const parseDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return { start, end };
};

const makeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { customer, items, paymentType } = req.body;
    if (!items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Sale must include at least one item." });
    }
    if (paymentType !== "cash") {
      return res
        .status(400)
        .json({ message: "Invalid payment type. Only 'cash' is allowed." });
    }
    let total = 0;
    const updatedItems = await Promise.all(
      items.map(async (saleItem) => {
        const item = await itemModel.findById(saleItem.item);
        if (!item) {
          return res
            .status(404)
            .json({ message: `Item with ID ${saleItem.item} not found.` });
        }
        if (item.quantity < saleItem.quantity) {
          return res
            .status(400)
            .json({ message: `Insufficient quantity for item ${item.name}.` });
        }
        // Reduce item stock and save
        item.quantity -= saleItem.quantity;
        await item.save();
        total += saleItem.quantity * item.price;
        return {
          item: saleItem.item,
          quantity: saleItem.quantity,
          price: item.price,
        };
      })
    );

    const sale = new saleModel({
      userId,
      customer,
      items: updatedItems,
      total,
      paymentType,
    });
    await sale.save();

    res.status(201).json({ message: "Order created successfully", sale });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: error.message || "Internal Server Error" });
  }
};

const allOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const sales = await saleModel
      .find({ userId })
      .populate("customer")
      .populate("items.item");
    res.status(200).json({ sales });
  } catch (error) {
    res.status(500).json({ message: "Internet Server Error" });
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
          .populate("items.item");
        return res.status(200).json({ sales });

      case "customerLedger":
        if (!customerName) {
          return res
            .status(400)
            .json({ message: "Customer name is required for ledger" });
        }
        const customer = await customerModel.findOne({ name: customerName });
        if (!customer) {  
          return res.status(404).json({ message: "Customer not found" });
        }
        const customerLedger = await saleModel
          .find({
            userId,
            customer: customer._id,
          })
          .populate("items.item");

        return res.status(200).json({ customerLedger });
    }
  } catch (error) {
    res.status(500).json({ message: "Internet Server Error" });
  }
};

module.exports = {
  makeOrder,
  allOrders,
  fetchReport,
};
