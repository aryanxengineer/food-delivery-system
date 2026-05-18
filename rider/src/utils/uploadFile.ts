import axios from "axios";
import getBuffer from "../config/dataURI.config.js";
import { env } from "../config/dotenv.config.js";
import logger from "../config/winston.config.js";
import { InternalServerError } from "./errors.js";

export const uploadFile = async (file: unknown) => {
  const fileBuffer = getBuffer(file);

  if (!fileBuffer?.content) {
    logger.info("Cannot get content after data uri parser.");
    throw new InternalServerError("Internal Server Error - File upload fail");
  }

  const { data: uploadResult } = await axios.post(
    `${env.UTILS_SERVICE}/api/upload`,
    {
      buffer: fileBuffer.content,
    },
  );

  return uploadResult;
};
