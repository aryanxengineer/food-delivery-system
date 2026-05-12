import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { isAuth, isSeller } from "../middlewares/authentication.middleware.js";
import { createRestaurantSchema } from "../validators/restaurant.schema.js";
import { RestaurantController } from "../controllers/restaurant.controller.js";
import { RestaurantService } from "../services/restaurant.service.js";

import upload from "../config/multer.config.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { TokenService } from "../services/token.service.js";

const restaurantRouter = Router();

const restaurantRepository = new RestaurantRepository();
const tokenService = new TokenService();
const restaurantService = new RestaurantService(restaurantRepository);
const restaurantController = new RestaurantController(tokenService, restaurantService);

restaurantRouter.use(isAuth);

restaurantRouter.get("/all", restaurantController.getNearbyRestaurant);
restaurantRouter.get("/:id", restaurantController.fetchSingleRestaurant);

restaurantRouter.use(isSeller);

restaurantRouter.post(
  "/new",
  validate(createRestaurantSchema),
  upload,
  restaurantController.addRestraunt,
);
restaurantRouter.get("/my", restaurantController.fetchMyRestaurant);
restaurantRouter.put("/status", restaurantController.updateStatusRestaurant);
restaurantRouter.put("/edit", restaurantController.updateRestaurant);

export default restaurantRouter;
