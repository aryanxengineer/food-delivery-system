import winston from "winston";

const { combine, timestamp, printf, colorize, errors, json } =
  winston.format;

// Custom format for console (readable)
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",

  format: combine(
    timestamp(),
    errors({ stack: true }) // capture stack trace
  ),

  transports: [
    // Console transport (dev-friendly)
    new winston.transports.Console({
      format: combine(colorize(), consoleFormat),
    }),

    // File transport (structured logs)
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: json(),
    }),

    new winston.transports.File({
      filename: "logs/combined.log",
      format: json(),
    }),
  ],
});

export default logger;