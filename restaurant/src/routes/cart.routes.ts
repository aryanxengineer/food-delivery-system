import { Router } from "express";
import { CartController } from "../controllers/cart.controller.js";
import { CartService } from "../services/cart.service.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { ItemRepository } from "../repositories/item.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";
import { validate } from "../middlewares/validate.middleware.js";
import { idsSchema } from "../validators/cart.schema.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

const cartRouter = Router();

const cartRepo = new CartRepository();
const itmeRepo = new ItemRepository();
const restaurantRepo = new RestaurantRepository();
const cartService = new CartService(restaurantRepo, itmeRepo, cartRepo);
const cartController = new CartController(cartService);

cartRouter.use(isAuth);

cartRouter.post("/add", validate(idsSchema), cartController.addToCart);
cartRouter.get("/all", cartController.fetchMyCart);
cartRouter.put("/inc", cartController.incrementCartItem);
cartRouter.put("/dec", cartController.decrementCartItem);
cartRouter.delete("/clear", cartController.clearCart);

export default cartRouter;
