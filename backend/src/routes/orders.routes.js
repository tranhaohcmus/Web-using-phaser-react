const express = require("express");
const router = express.Router();
const OrdersController = require("../controllers/orders.controller");
const authenticate = require("../middleware/auth");
const validate = require("../middleware/validate");
const { createOrderValidator } = require("../validators/order.validator");

// All order routes require authentication
router.use(authenticate);

router.post("/", createOrderValidator, validate, OrdersController.createOrder);
router.get("/", OrdersController.getOrders);
router.get("/:orderNumber", OrdersController.getOrderDetails);
router.post("/:orderNumber/cancel", OrdersController.cancelOrder);

module.exports = router;
