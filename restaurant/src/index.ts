import cors from "cors";
import express from "express";
import indexRouter from "./routes/index.js";
import connectDB from "./config/database.config.js";
import { env } from "./config/dotenv.config.js";
import logger from "./config/winston.config.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = env.PORT || 5001;

app.use("/auth/v1", indexRouter);

app.listen(PORT, () => {
  connectDB();
  logger.info(`Restaurant service is running on port ${PORT}`);
});
