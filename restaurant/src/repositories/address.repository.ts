import AddressModel from "../models/address.model.js";
import { CreateAddressInput } from "../validators/address.schema.js";

export class AddressRepository {
  constructor() {}

  create = async (userId: string, addressData: CreateAddressInput) => {
    return AddressModel.create({
      userId,
      mobile: addressData.mobile,
      formattedAddress: addressData.formattedAddress,
      location: {
        type: "Point",
        coordinates: [addressData.longitude, addressData.latitude],
      },
    });
  };

  find = async (userId: string) => {
    return AddressModel.find({ userId }).sort({ createdAt: -1 });
  };

  findOne = async (userId: string, addressId: string) => {
    return AddressModel.findOne({ userId, _id: addressId });
  };

  deleteOne = async (userId: string, addressId: string) => {
    return AddressModel.deleteOne({ _id: addressId, userId });
  };
}
