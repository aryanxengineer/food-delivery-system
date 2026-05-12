import { oauth2client } from "../config/oauth2.client.js";
import logger from "../config/winston.config.js";
import axios from "axios";

export class GoogleService {
  constructor() {}

  authorizeUser = async (code: string) => {
    try {
      const googleRes = await oauth2client.getToken(code);

      oauth2client.setCredentials(googleRes.tokens);

      const userRes = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
      );

      const { email, name, picture } = userRes.data;

      return {
        name,
        email,
        picture,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          "Google authorization failed ",
          error.message,
          error.stack,
        );
      } else {
        logger.error("Google authorization failed ", error);
      }
    }
  };
}
