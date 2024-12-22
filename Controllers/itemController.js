const itemModel = require("../Models/itemSchema");

const addItem = async (req, res) => {
  try {
    const { name, description, quantity, price } = req.body;
    const userId = req.user.id;
    const existingName = await itemModel.findOne({ name });
    if (existingName) {
      return res.status(400).json({ message: "Item already exists" });
    }
    const newItem = new itemModel({
      userId,
      name,
      description,
      quantity,
      price,
    });
    await newItem.save();
    res.status(201).json({ message: "Item created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internet Server Error" });
  }
};

const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, price } = req.body;
    const userId = req.user.id;
    const item = await itemModel.findOne({ _id: id, userId });
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    item.name = name;
    item.description = description;
    item.quantity = quantity;
    item.price = price;
    await item.save();
    res.status(200).json({ message: "Item updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const allItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await itemModel.find({ userId });
    res.status(200).json({ message: "Items retrieved successfully", items });
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
      return res.status(404).json({ message: "Item not found" });
    }
    await itemModel.deleteOne({ _id: id });
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  addItem,
  updateItem,
  allItems,
  deleteItem,
};
