import { ItemRepository } from "../repositories/item.repository.js";
import { CreateItemInput } from "../validators/item.schema.js";
import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { NotFoundError, UnauthorizedError } from "../utils/errors.js";
import { uploadFile } from "../utils/uploadFile.js";

export class ItemService {
  constructor(
    private itemRepo: ItemRepository,
    private restaurantRepo: RestaurantRepository,
  ) {}

  addMenuItem = async (
    userId: string,
    data: CreateItemInput,
    file: Express.Multer.File,
  ) => {
    const restaurant = await this.restaurantRepo.findByOwnerId(userId);
    if (!restaurant) {
      throw new UnauthorizedError("Restaurant not - Unauthorize owner");
    }

    const uploadResult = await uploadFile(file);
    const item = await this.itemRepo.create(
      data,
      uploadResult.url,
      restaurant._id.toString(),
    );

    return item;
  };

  getAllItems = async (id: string) => {
    const items = await this.itemRepo.find(id);
    if (!items) {
      throw new NotFoundError("Items not found");
    }
    return items;
  };

  deleteMenuItem = async (itemId: string, userId: string) => {
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item not found - Invalid item id");
    }

    const restaurant = await this.restaurantRepo.exists(
      item.restaurantId.toString(),
      userId,
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant does not have any item like this.");
    }

    await this.itemRepo.findOneAndDelete(itemId);

    return;
  };

  toggleMenuItemAvailability = async (itemId: string, userId: string) => {
    const item = await this.itemRepo.findById(itemId);
    if (!item) {
      throw new NotFoundError("Item not found - Invalid item id");
    }

    const restaurant = await this.restaurantRepo.exists(
      item.restaurantId.toString(),
      userId,
    );

    if (!restaurant) {
      throw new NotFoundError("Restaurant does not have any item like this.");
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    return {
      message: `Item Marked as ${
        item.isAvailable ? "available" : "unavailable"
      }`,
      item,
    };
  };
}
