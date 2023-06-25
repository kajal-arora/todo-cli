import express, { NextFunction, Request, Response } from "express";
import { RedisClientType, createClient } from "redis";
// import { REDIS_URI } from "../../common/constants";
import { validateRequest } from "../../common/validateRequest";
import { getRdsClient } from "../../db/rdsClient";
import { SaveOperations } from "../../services/fileInterface";

import { SaveToFileService } from "../../services/saveToFileService";

const router = express.Router();

const FILE_NAME = "todo.json";
let sfs: SaveOperations = new SaveToFileService(FILE_NAME);
// let redisInstance: RedisClientType;

// async function initialiseRedis() {
//     const rds = await getRdsClient();
//     sfs = new SaveToFileService(FILE_NAME, rds);
// }

// initialiseRedis();

// (async () => {
//   redisInstance = createClient({
//     url: REDIS_URI,
//   }); // Await the resolved Redis instance promise

//   await redisInstance.connect();
//   sfs = new SaveToFileService(FILE_NAME, redisInstance);
// })();

router.get("/", (req: Request, res: Response) => {
  res.status(200).json("ok");
});

router.get(
  "/api/items",
  validateRequest,
  async (req: Request, res: Response) => {
    const items = await sfs.getData(req.currentUser?.uuid!);
    res.status(200).json(items);
  }
);

router.post(
  "/api/item",
  validateRequest,
  async (req: Request, res: Response) => {
    const result = await sfs.saveRecord(req.body.data, req.currentUser?.uuid!);
    if (result) {
      res.status(200).json("Item added successfully.");
    } else {
      res.status(500).json("error occured in adding");
    }
  }
);

router.put(
  "/api/item/complete/:id",
  validateRequest,
  async (req: Request, res: Response) => {
    const result = await sfs.completeActivity(Number(req.params.id), req.currentUser?.uuid!);
    if (result) {
      res.status(200).json("marked as complete");
    } else {
      res.status(500).json("error occured while marking it as complete.");
    }
  }
);

router.put(
  "/api/item/:id",
  validateRequest,
  async (req: Request, res: Response) => {
    const result = await sfs.updateRecord(req.body.data, Number(req.params.id), req.currentUser?.uuid!);
    if (result) res.status(200).json("updated");
    else {
      res.status(500).json("error occured in updating");
    }
  }
);

router.delete(
  "/api/item/:id",
  validateRequest,
  async (req: Request, res: Response) => {
    const result = await sfs.deleteRecord(Number(req.params.id), req.currentUser?.uuid!);
    if (result) {
      res.status(200).json("deleted");
    } else {
      res.status(500).json("error occured while deleing.");
    }
  }
);

export { router as fileOperationsRouter };
