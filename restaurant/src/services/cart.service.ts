import { CartRepository } from "../repositories/cart.repository.js";
import { ItemRepository } from "../repositories/item.repository.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";

export class CartService {
  constructor(
    private restaurantRepo: RestaurantRepository,
    private itemRepo: ItemRepository,
    private cartRepo: CartRepository,
  ) {}

  addToCart = async (userId: string, restaurantId: string, itemId: string) => {
    const cartFromOtherRestaurant = await this.cartRepo.findCartFromDifferentRestaurant(
      userId,
      restaurantId,
    );

    if (cartFromOtherRestaurant) {
      throw new BadRequestError(
        "You can order from only one restaurant at a time. Please clear your cart first to add items from this restaurant.",
      );
    }

    const cart = await this.cartRepo.findOneAndUpdate(
      userId,
      restaurantId,
      itemId,
    );

    return cart;
  };

  fetchMyCart = async (userId: string) => {
    const cartItems = await this.cartRepo.find(userId);

    if (!cartItems) {
      throw new NotFoundError("Cart items not found");
    }

    let subtotal = 0;
    let cartLength = 0;

    for (const cartItem of cartItems) {
      const item: any = cartItem.itemId;

      subtotal += item.price * cartItem.quantity;
      cartLength += cartItem.quantity;
    }

    return {
      cartLength,
      subtotal,
      cart: cartItems,
    };
  };

  incrementCartItem = async (userId: string, itemId: string) => {
    const cartItem = await this.cartRepo.increment(userId, itemId);

    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    return cartItem;
  };

  decrementCartItem = async (userId: string, itemId: string) => {
    const cartItem = await this.cartRepo.findOne(userId, itemId);

    if (!cartItem) {
      throw new NotFoundError("Cart item not found");
    }

    if (cartItem.quantity === 1) {
      await this.cartRepo.deleteOne(userId, itemId);

      return {
        message: "Item removed from your cart.",
      };
    }

    const item = await this.cartRepo.decrement(userId, itemId);

    return {
      item
    };
  };

  clearCart = async (userId: string) => {
    await this.cartRepo.deleteMany(userId);
    return;
  };
}
