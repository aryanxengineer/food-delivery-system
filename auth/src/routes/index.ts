import { Router } from "express";
import { UserRepository } from "../repository/user.repository.js";
import { TokenService } from "../service/token.service.js";
import { GoogleService } from "../service/google.service.js";
import { AuthService } from "../service/auth.service.js";
import { AuthController } from "../controller/auth.controller.js";
import { isAuth } from "../middlewares/authentication.middleware.js";

const indexRouter = Router();

const userRepo = new UserRepository();
const tokenService = new TokenService();
const googleService = new GoogleService();
const authService = new AuthService(tokenService, googleService, userRepo);
const authController = new AuthController(authService);

indexRouter.post("/login", authController.login);

indexRouter.use(isAuth);

indexRouter.put("/add/role", authController.addRole);
indexRouter.get("/me", authController.me);

export default indexRouter;
