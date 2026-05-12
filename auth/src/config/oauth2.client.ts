import { google } from "googleapis";
import { env } from "./dotenv.config.js";

export const oauth2client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  "postmessage",
);
