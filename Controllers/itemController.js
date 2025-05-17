const itemModel = require("../Models/itemSchema");
const STATUS = require("../utils/statusCodes");
const MESSAGES = require("../utils/messages");

const addItem = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const userId = req.user.id;
    const existingName = await itemModel.findOne({ name });
    if (existingName) {
      return res
        .status(STATUS.BAD_REQUEST)
        .json({ message: MESSAGES.ITEM_EXISTS });
    }
    const newItem = new itemModel({
      userId,
      name,
      description,
      quantity,
      price,
    });
    await newItem.save();
    res
      .status(STATUS.CREATED)
      .json({ message: MESSAGES.ITEM_CREATED, newItem });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const userId = req.user.id;
    const item = await itemModel.findOne({ _id: id, userId });
    if (!item) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: MESSAGES.ITEM_UPDATED });
    }
    item.name = name;
    item.description = description;
    item.quantity = quantity;
    item.price = price;
    await item.save();
    res.status(STATUS.OK).json({ message: MESSAGES.ITEM_UPDATED });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

const allItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await itemModel.find({ userId });
    res.status(STATUS.OK).json({ message: MESSAGES.ITEMS_RETRIEVED, items });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const item = await itemModel.findOne({ _id: id, userId });
    if (!item) {
      return res
        .status(STATUS.NOT_FOUND)
        .json({ message: MESSAGES.ITEM_NOT_FOUND });
    }
    await itemModel.deleteOne({ _id: id });
    res.status(STATUS.OK).json({ message: MESSAGES.ITEM_DELETED });
  } catch (error) {
    res
      .status(STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: MESSAGES.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  addItem,
  updateItem,
  allItems,
  deleteItem,
};
