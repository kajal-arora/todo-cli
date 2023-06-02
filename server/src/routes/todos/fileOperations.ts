import express, { Request, Response } from "express";
import { RedisClientType, createClient } from "redis";
import { SaveOperations } from "../../services/fileInterface";

import { SaveToFileService } from "../../services/saveToFileService";

const router = express.Router();

const FILE_NAME = "todo.json";
let sfs:SaveOperations; 
let redisInstance: RedisClientType;

(async () => {
  redisInstance = createClient({
    url: process.env.REDIS_URI,
  }); // Await the resolved Redis instance promise

  await redisInstance.connect();
  sfs = new SaveToFileService(FILE_NAME, redisInstance);
})();


router.get("/", (req: Request, res: Response) => {
  res.status(200).json("ok");
});

router.get("/api/items", async (req: Request, res: Response) => {
  const items = await sfs.getData();
  res.send(items);
  res.status(200);
});

router.post("/api/item", async (req: Request, res: Response) => {
  const result = await sfs.saveRecord(req.body.data);
  if (result) {
    res.status(200).json("Item added successfully.");
  } else {
    res.status(500).json("error occured in adding");
  }
});

router.put("/api/item/:id", async (req: Request, res: Response) => {
  const result = await sfs.updateRecord(req.body.data, Number(req.params.id));
  if (result) res.status(200).json("updated");
  else {
    res.status(500).json("error occured in updating");
  }
});

router.put("/api/item/complete/:id", async (req: Request, res: Response) => {
  const result = await sfs.completeActivity(Number(req.params.id));
  if (result) {
    res.status(200).json("marked as complete");
  } else {
    res.status(500).json("error occured while marking it as complete.");
  }
});

router.delete("/api/item/:id", async (req: Request, res: Response) => {
  const result = await sfs.deleteRecord(Number(req.params.id));
  if (result) {
    res.status(200).json("deleted");
  } else {
    res.status(500).json("error occured while deleing.");
  }
});

export { router as fileOperationsRouter}
