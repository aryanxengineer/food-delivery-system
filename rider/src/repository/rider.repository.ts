import RiderProfileModel from "../model/rider.model.js";

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
}
