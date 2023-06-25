import * as dotenv from "dotenv";

dotenv.config();

export const PORT = 8100;
export const JWT_KEY = process.env.JWT_KEY;
export const REDIS_HOST = process.env.REDIS_HOST;
export const REDIS_PORT = process.env.REDIS_PORT;
export const REDIS_PW = process.env.REDIS_PW;