import { Router } from "express";
import { isAdmin, isAuth } from "../middlewares/authentication.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { RiderRepository } from "../repositories/rider.repository.js";
import { AdminService } from "../services/admin.service.js";

const indexRouter = Router();

const riderRepo = new RiderRepository();
const restaurantRepo = new RestaurantRepository();
const adminService = new AdminService(restaurantRepo, riderRepo);
const adminController = new AdminController(adminService);

indexRouter.use(isAuth);
indexRouter.use(isAdmin);

indexRouter.get(
  "/admin/restaurant/pending",
  adminController.getPendingRestaurant,
);
indexRouter.get("/admin/rider/pending", adminController.getPendingRiders);
indexRouter.get("/verify/rider/:id", adminController.verifyRider);
indexRouter.get("/verify/restaurant/:id", adminController.verifyRestaurant);

export default indexRouter;
