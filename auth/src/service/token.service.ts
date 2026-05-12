import { env } from "../config/dotenv.config.js";
import { IUser } from "../models/user.model.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export class TokenService {
  constructor() {}

  getAccessToken = (user: IUser): string => {
    return jwt.sign({ user }, env.JWT_SECRET, { expiresIn: "15d" });
  };

  verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  }
}
