const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController");
const itemController = require("../Controllers/itemController");
const customerController = require("../Controllers/customerController");
const saleController = require("../Controllers/saleController");
const verifyToken = require("../Middlewares/authMiddleware");

router.post("/signup", userController.signUp);
router.post("/signin", userController.signIn);
router.post("/logout", userController.logOut);

router.post("/additem", verifyToken, itemController.addItem);
router.get("/items", verifyToken, itemController.allItems);
router.put("/edititem/:id", verifyToken, itemController.updateItem);
router.delete("/deleteitem/:id", verifyToken, itemController.deleteItem);

router.post("/addcustomer", verifyToken, customerController.addCustomer);
router.get("/customers", verifyToken, customerController.allCustomers);

router.post("/sales", verifyToken, saleController.makeOrder);
router.get("/sales", verifyToken, saleController.allOrders);

router.get("/reports/:reportType", verifyToken, saleController.fetchReport);

module.exports = router;
