// services/address.service.ts

import { AddressRepository } from "../repositories/address.repository.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { CreateAddressInput } from "../validators/address.schema.js";

export class AddressService {
  constructor(private addressRepository: AddressRepository) {}

  /**
   * Add New Address
   */
  addAddress = async (userId: string, addressData: CreateAddressInput) => {
    const newAddress = await this.addressRepository.create(userId, addressData);
    if (!newAddress) {
      throw new BadRequestError("Bad request - Invalid data");
    }

    return newAddress;
  };

  /**
   * Delete Address
   */
  deleteAddress = async (userId: string, addressId: string) => {
    const address = await this.addressRepository.findOne(userId, addressId);
    if (!address) {
      throw new NotFoundError("Address not found to delete");
    }

    await this.addressRepository.deleteOne(userId, addressId);

    return;
  };

  /**
   * Fetch My Addresses
   */
  getMyAddresses = async (userId: string) => {
    const addresses = await this.addressRepository.find(userId);

    if (!addresses || addresses.length === 0) {
      throw new NotFoundError("Address not found or not avaialable");
    }

    return addresses;
  };
}
