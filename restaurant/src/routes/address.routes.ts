import { Router } from "express";
import { isAuth } from "../middlewares/authentication.middleware.js";
import { AddressRepository } from "../repositories/address.repository.js";
import { AddressService } from "../services/address.service.js";
import { AddressController } from "../controllers/address.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createAddressSchema } from "../validators/address.schema.js";

const addressRouter = Router();

const addressRepository = new AddressRepository();
const addressService = new AddressService(addressRepository);
const addressController = new AddressController(addressService);

addressRouter.use(isAuth);

addressRouter.post("/new", validate(createAddressSchema), addressController.addAddress);
addressRouter.delete("/:id", addressController.deleteAddress);
addressRouter.get("/all", addressController.getMyAddresses);

export default addressRouter;
