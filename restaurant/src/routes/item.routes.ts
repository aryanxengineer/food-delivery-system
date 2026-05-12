import upload from "../config/multer.config.js";

import { Router } from "express";
import { isAuth, isSeller } from "../middlewares/authentication.middleware.js";
import { ItemController } from "../controllers/item.controller.js";
import { ItemRepository } from "../repositories/item.repository.js";
import { ItemService } from "../services/item.service.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createItemSchema } from "../validators/item.schema.js";

const itemRouter = Router();

const itemRepository = new ItemRepository();
const restaurantRepository = new RestaurantRepository();
const itemService = new ItemService(itemRepository, restaurantRepository);
const itemController = new ItemController(itemService);

itemRouter.use(isAuth);

itemRouter.get("/all/:id", itemController.getAllItems);

itemRouter.use(isSeller);

itemRouter.post(
  "/new",
  validate(createItemSchema),
  upload,
  itemController.addMenuItem,
);
itemRouter.delete("/:itemId", itemController.deleteMenuItem);
itemRouter.put("/status/:itemId", itemController.toggleMenuItemAvailability);

export default itemRouter;
