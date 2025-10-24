const express = require("express");
const router = express.Router();
const AdminOrdersController = require("../../controllers/admin/orders.controller");
const authenticate = require("../../middleware/auth");
const requireAdmin = require("../../middleware/admin");
const validate = require("../../middleware/validate");
const {
  updateOrderStatusValidator,
} = require("../../validators/order.validator");

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// Statistics should be before :order_number route
router.get("/statistics", AdminOrdersController.getStatistics);

router.get("/", AdminOrdersController.getAllOrders);
router.get("/:order_number", AdminOrdersController.getOrderDetails);
router.patch(
  "/:order_number/status",
  updateOrderStatusValidator,
  validate,
  AdminOrdersController.updateOrderStatus
);

module.exports = router;
