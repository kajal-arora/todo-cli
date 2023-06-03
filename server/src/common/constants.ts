import * as dotenv from "dotenv";

dotenv.config();

export const PORT = 8100;
export const JWT_KEY = process.env.JWT_KEY;
export const REDIS_URI = process.env.REDIS_URI;