import { env } from "../config/dotenv.config.js";
import jwt, { JwtPayload } from "jsonwebtoken";

export class TokenService {
  constructor() {}

  getAccessToken = (user: unknown): string => {
    return jwt.sign({ user }, env.JWT_SEC, { expiresIn: "15d" });
  };

  verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, env.JWT_SEC) as JwtPayload;
  }
}
