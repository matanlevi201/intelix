import { createLogger, transports, format } from "winston";
import { env } from "../config";

const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} ${label} [${level}]: ${message}`;
});

export const logger = createLogger({
  level: "info",
  format: combine(format.colorize(), label({ label: "dev" }), timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), myFormat),
  transports: [new transports.Console({ silent: env.NODE_ENV === "test" })],
});
