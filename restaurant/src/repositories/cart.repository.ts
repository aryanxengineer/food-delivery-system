import CartModel from "../models/cart.model.js";

export class CartRepository {
  constructor() {}

  find = async (userId: string) => {
    return CartModel.find({ userId })
      .populate("itemId")
      .populate("restaurantId");
  };

  findCartFromDifferentRestaurant = async (
    userId: string,
    restaurantId: string,
  ) => {
    return CartModel.findOne({
      userId,
      restaurantId: { $ne: restaurantId },
    });
  };

  findOne = async (userId: string, itemId: string) => {
    return CartModel.findOne({ userId, itemId });
  };

  findOneAndUpdate = async (
    userId: string,
    restaurantId: string,
    itemId: string,
  ) => {
    return CartModel.findOneAndUpdate(
      { userId, restaurantId, itemId },
      {
        $inc: { quantity: 1 },
        $setOnInsert: { userId, restaurantId, itemId },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );
  };

  increment = async (userId: string, itemId: string) => {
    return CartModel.findOneAndUpdate(
      { userId, itemId },
      { $inc: { quantity: 1 } },
      { new: true },
    );
  };

  decrement = async (userId: string, itemId: string) => {
    return CartModel.findOneAndUpdate(
      { userId, itemId },
      { $inc: { quantity: -1 } },
      { new: true },
    );
  };

  deleteOne = async (userId: string, itemId: string) => {
    return CartModel.deleteOne({ userId, itemId });
  };

  deleteMany = async (userId: string) => {
    return CartModel.deleteMany({ userId });
  };
}
