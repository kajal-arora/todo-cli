import "express-async-errors";
import * as dotenv from "dotenv";
import { rds } from "./db/redisClient";
import { app } from './app';
import express, { Request, Response } from "express";
import { errorHandler } from "@karancultor/common";
import { SaveToFileService } from "./services/saveToFileService";
import { signupRouter } from "./routes/auth/signup";


dotenv.config();

const PORT = 8100;
const JWT_KEY = process.env.JWT_KEY;
const REDIS_URI = process.env.REDIS_URI;
const FILE_NAME = "todo.json";

const start = async () => {
  if (!REDIS_URI) throw new Error("REDIS URI NOT FOUND IN ENV");
  if (!JWT_KEY) throw new Error("JWT key not found in env.");
 
  // await rds.create(REDIS_URI!);
  // await rds.connect();
  // const redisInstance = await rds; // Await the resolved Redis instance promise

  // // Use the resolved Redis instance for further operations
  // await redisInstance.connect();
  
  app.listen(PORT, "localhost", () => {
    console.log(`Listening at Port ${PORT}`);
  });
}

start();





// dependy injections
// const sfs = new SaveToFileService(FILE_NAME, rds.client);

// app.get("/", (req: Request, res: Response) => {
//   res.status(200).json("ok");
// });

// app.get("/api/items", async (req: Request, res: Response) => {
//   const items = await sfs.getData();
//   res.send(items);
//   res.status(200);
// });

// app.post("/api/item", async (req: Request, res: Response) => {
//   const result = await sfs.saveRecord(req.body.data);
//   if (result) {
//     res.status(200).json("Item added successfully.");
//   } else {
//     res.status(500).json("error occured in adding");
//   }
// });

// app.put("/api/item/:id", async (req: Request, res: Response) => {
//   const result = await sfs.updateRecord(req.body.data, Number(req.params.id));
//   if (result) res.status(200).json("updated");
//   else {
//     res.status(500).json("error occured in updating");
//   }
// });

// app.put("/api/item/complete/:id", async (req: Request, res: Response) => {
//   const result = await sfs.completeActivity(Number(req.params.id));
//   if (result) {
//     res.status(200).json("marked as complete");
//   } else {
//     res.status(500).json("error occured while marking it as complete.");
//   }
// });

// app.delete("/api/item/:id", async (req: Request, res: Response) => {
//   const result = await sfs.deleteRecord(Number(req.params.id));
//   if (result) {
//     res.status(200).json("deleted");
//   } else {
//     res.status(500).json("error occured while deleing.");
//   }
// });

// app.use(errorHandler);
app.use(signupRouter);


