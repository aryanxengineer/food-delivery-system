import { Router } from "express";
import { isAuth, isSeller } from "../middlewares/authentication.middleware.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { OrderService } from "../services/order.service.js";
import { OrderController } from "../controllers/order.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { inputCreateOrder } from "../validators/order.schema.js";

const orderRouter = Router();

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

orderRouter.put("/assign/rider", orderController.assignRiderToOrder);
orderRouter.get("/current/rider", orderController.getCurrentOrderForRider);
orderRouter.put("/update/status/rider", orderController.updateOrderStatusRider);
orderRouter.get("/payment/:id", orderController.fetchOrderForPayment);

orderRouter.use(isAuth);

orderRouter.post("/new", validate(inputCreateOrder), orderController.createOrder);
orderRouter.get("/myorder", orderController.getMyOrders);
orderRouter.get("/:id", orderController.fetchSingleOrder);

orderRouter.use(isSeller);

orderRouter.get(
  "/restaurant/:restaurantId",
  orderController.fetchRestaurantOrders,
);
orderRouter.put("/:orderId", orderController.updateOrderStatus);

export default orderRouter;
