import RestaurantModel, { IRestaurant } from "../models/restaurant.model.js";
import { NearbyRestaurantQueryInput } from "../validators/nearByRestaurant.schema.js";
import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../validators/restaurant.schema.js";

export class RestaurantRepository {
  constructor() {}

  findByOwnerId = async (ownerId: string) => {
    return RestaurantModel.findOne({ ownerId });
  };

  create = async (
    ownerId: string,
    restauarantInputData: CreateRestaurantInput,
    url: string,
  ): Promise<IRestaurant> => {
    const { name, description, phone, longitude, latitude, formattedAddress } =
      restauarantInputData;

    return RestaurantModel.create({
      name,
      ...(description && { description }),
      phone,
      image: url,
      ownerId,
      autoLocation: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
        formattedAddress,
      },
      isVerified: false,
    });
  };

  exists = async (restaurantId: string, userId: string) => {
    return RestaurantModel.exists({
      _id: restaurantId,
      ownerId: userId,
    }).lean();
  };

  findOneAndUpdate = async (
    userId: string,
    data: Partial<UpdateRestaurantInput>,
  ) => {
    return RestaurantModel.findOneAndUpdate({ ownerId: userId }, data, {
      new: true,
    });
  };

  nearRestaurant = async (query: any, data: NearbyRestaurantQueryInput) => {
    const { longitude, latitude, radius } = data;

    return RestaurantModel.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          distanceField: "distance",
          maxDistance: radius,
          spherical: true,
          query,
        },
      },
      {
        $sort: {
          isOpen: -1,
          distance: 1,
        },
      },
      {
        $addFields: {
          distanceKm: {
            $round: [{ $divide: ["$distance", 1000] }, 2],
          },
        },
      },
    ]);
  };

  findById = async (id: string) => {
    return RestaurantModel.findById(id);
  };
}
