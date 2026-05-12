import ItemModel from "../models/item.model.js";
import { CreateItemInput } from "../validators/item.schema.js";

export class ItemRepository {
  constructor() {}

  create = async (
    data: CreateItemInput,
    url: string,
    restaurantId: string,
  ) => {};

  find = async (id: string) => {
    return ItemModel.find({ restaurantId: id });
  };
  
  findById = async (itemId: string) => {
    return ItemModel.findById(itemId);
  };

  findOneAndDelete = async (itemId: string) => {
    return ItemModel.findOneAndDelete({ _id: itemId });
  };
}
