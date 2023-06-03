import "express-async-errors";
import { app } from "./app";
import { REDIS_URI, JWT_KEY, PORT } from "./common/constants";


const start = async () => {
  if (!REDIS_URI) throw new Error("REDIS URI NOT FOUND IN ENV");
  if (!JWT_KEY) throw new Error("JWT key not found in env.");
  app.listen(PORT, "localhost", () => {
    console.log(`Listening at Port ${PORT}`);
  });
};

start();

// app.use(errorHandler);
