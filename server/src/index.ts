import "express-async-errors";
import { app } from "./app";
import { REDIS_HOST,REDIS_PORT, JWT_KEY, PORT } from "./common/constants";


const start = async () => {
  if (!REDIS_HOST) throw new Error("REDIS HOST not found in env.");
  if (!REDIS_PORT) throw new Error("REDIS PORT not found in env.");
  if (!JWT_KEY) throw new Error("JWT key not found in env.");
  app.listen(PORT, "localhost", () => {
    console.log(`Listening at Port ${PORT}`);
  });
};

start();

// app.use(errorHandler);
