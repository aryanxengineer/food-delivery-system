import { Router } from "express";
import { isAuth, isRider } from "../middleware/authentication.middleware.js";
import upload from "../config/multer.config.js";
import { RiderController } from "../controller/rider.controller.js";
import { RiderService } from "../service/rider.service.js";
import { RiderRepository } from "../repository/rider.repository.js";

const riderRoutes = Router();

const riderRepository = new RiderRepository();
const riderService = new RiderService(riderRepository);
const riderController = new RiderController(riderService);

riderRoutes.use(isAuth);
riderRoutes.use(isRider);

riderRoutes.post("/new", upload, riderController.addRiderProfile);
riderRoutes.get("/myprofile", riderController.fetchMyProfile);
riderRoutes.patch("/toggle", riderController.toggleRiderAvailablity);
riderRoutes.post("/accept/:orderId", riderController.acceptOrder);
riderRoutes.get("/order/current", riderController.fetchMyCurrentOrder);
riderRoutes.put("/order/update/:orderId", riderController.updateOrderStatus);

export default riderRoutes;
