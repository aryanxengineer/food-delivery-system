import express from "express";
import cors from "cors";

import connectDB from "./config/database.config.js";
import indexRouter from "./routes/index.js";

const app = express();

app.use(cors({
  origin: "*",
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', indexRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Auth service is running on port ${PORT}`);
  connectDB();
});
