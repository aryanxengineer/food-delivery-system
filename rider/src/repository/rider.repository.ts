import RiderProfileModel, { IRiderProfile } from "../model/rider.model.js";
import { UpdateRiderProfileType } from "../validator/rider.schema.js";

export class RiderRepository {
  constructor() {}

  findOne = async (riderId: string) => {
    return RiderProfileModel.findOne({ riderId });
  };

  exists = async (riderId: string) => {
    return RiderProfileModel.exists({ riderId });
  };

  create = async (data: any) => {
    return RiderProfileModel.create(data);
  };

  toggleAvailability = async (
    riderId: string,
    data: Partial<IRiderProfile>,
  ) => {
    return RiderProfileModel.findOneAndUpdate({ riderId }, data, { new: true });
  };
}
