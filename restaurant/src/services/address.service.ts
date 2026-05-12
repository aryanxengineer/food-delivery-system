// services/address.service.ts

import { AddressRepository } from "../repositories/address.repository.js";

export class AddressService {
  constructor(
    private addressRepository: AddressRepository,
  ) {}

  /**
   * Add New Address
   */
  addAddress = async (
    userId: string,
    addressData: unknown,
  ) => {};

  /**
   * Delete Address
   */
  deleteAddress = async (
    userId: string,
    addressId: string,
  ) => {};

  /**
   * Fetch My Addresses
   */
  getMyAddresses = async (
    userId: string,
  ) => {};
}