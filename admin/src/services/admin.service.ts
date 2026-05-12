import { RestaurantRepository } from "../repositories/restaurant.repository.js";
import { RiderRepository } from "../repositories/rider.repository.js";
import { NotFoundError } from "../utils/errors.js";

export class AdminService {
  constructor(
    private restaurantRepo: RestaurantRepository,
    private riderRepo: RiderRepository,
  ) {}

  // Get Pending Restaurant service
  public getPendingRestaurant = async () => {
    const restaurants = await this.restaurantRepo.findPending();
    if (!restaurants) {
      throw new NotFoundError("Restaurants not founds");
    }

    if (restaurants.length === 0) return [];

    return restaurants;
  };

  // Get Pending Riders service
  public getPendingRiders = async () => {
    const riders = await this.riderRepo.findPending();
    if (!riders) {
      throw new NotFoundError("Riders not founds");
    }

    if (riders.length === 0) return [];

    return riders;
  };

  // Verify Rider
  public verifyRider = async (id: string) => {
    const verifiedRider = await this.riderRepo.verifyById(id);

    if (verifiedRider.matchedCount === 0) {
      throw new NotFoundError("Rider not found");
    }

    return;
  };

  // Verify Restaurant
  public verifyRestaurant = async (id: string) => {
    const verifiedRestaurant = await this.restaurantRepo.verifyById(id);

    if (verifiedRestaurant.matchedCount === 0) {
      throw new NotFoundError("Restaurant not found");
    }

    return;
  };
}
