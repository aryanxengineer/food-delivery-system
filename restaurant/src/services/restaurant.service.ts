import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { BadRequestError, ConflictError, NotFoundError } from "../utils/errors.js";
import { uploadFile } from "../utils/uploadFile.js";
import { NearbyRestaurantQueryInput } from "../validators/nearByRestaurant.schema.js";
import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../validators/restaurant.schema.js";

export class RestaurantService {
  constructor(private restaurantRepository: RestaurantRepository) {}

  addRestaurant = async (
    userId: string,
    restauarantInputData: CreateRestaurantInput,
    file: Express.Multer.File,
  ) => {
    const existingRestaunrant =
      await this.restaurantRepository.findByOwnerId(userId);

    if (existingRestaunrant) {
      throw new ConflictError("Already one restaurant registered.");
    }

    const uploadResult = await uploadFile(file);

    const restaurant = await this.restaurantRepository.create(
      userId,
      restauarantInputData,
      uploadResult.url,
    );

    return restaurant;
  };

  fetchMyRestaurant = async (userId: string) => {
    const restaurant = await this.restaurantRepository.findByOwnerId(userId);
    if (!restaurant) {
      throw new BadRequestError("Bad request - restaurant not found");
    }

    return restaurant;
  };

  updateStatusRestaurant = async (
    userId: string,
    data: Partial<UpdateRestaurantInput>,
  ) => {
    const restaurant = await this.restaurantRepository.findOneAndUpdate(
      userId,
      data,
    );

    if (!restaurant) {
      throw new BadRequestError("Bad request - restaurant not found");
    }

    return restaurant;
  };

  updateRestaurant = async (
    userId: string,
    data: Partial<UpdateRestaurantInput>,
  ) => {
    const restaurant = await this.restaurantRepository.findOneAndUpdate(
      userId,
      data,
    );

    if (!restaurant) {
      throw new BadRequestError("Bad request - restaurant not found");
    }

    return restaurant;
  };

  getNearbyRestaurant = async (data: NearbyRestaurantQueryInput) => {
    const { search } = data;

    const query: any = {
      isVerified: true,
    };

    if (search && typeof search === "string") {
      query.name = { $regex: search, $options: "i" };
    }

    const restaurants = await this.restaurantRepository.nearRestaurant(
      query,
      data,
    );

    if (!restaurants) {
      throw new BadRequestError("Invalid data - Bad request");
    }

    return {
      restaurantCounts: restaurants.length,
      restaurants,
    };
  };

  fetchSingleRestaurant = async (id: string) => {
    const restaurant = await this.restaurantRepository.findById(id);
    if(!restaurant) {
      throw new NotFoundError("Restaurant not found");
    }
    return restaurant;
  };
}

// is baat kahu kya ijajat hai.
