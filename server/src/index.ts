import "express-async-errors";
import * as dotenv from "dotenv";
import { app } from './app';

dotenv.config();

const PORT = 8100;
const JWT_KEY = process.env.JWT_KEY;
const REDIS_URI = process.env.REDIS_URI;


const start = async () => {
  if (!REDIS_URI) throw new Error("REDIS URI NOT FOUND IN ENV");
  if (!JWT_KEY) throw new Error("JWT key not found in env.");
  app.listen(PORT, "localhost", () => {
    console.log(`Listening at Port ${PORT}`);
  });
}

start();

// app.use(errorHandler);



