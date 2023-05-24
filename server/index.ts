import "express-async-errors";
``;
import { errorHandler } from "@karancultor/common";
import express, { Request, Response } from "express";
import { SaveToFileService } from "./services/saveToFileService";

let app = express();
// added below middlewares to parse incoming requests.. to read body for post requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 8100;

const FILE_NAME = "todo.txt";
const sfs = new SaveToFileService(FILE_NAME);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json("ok");
});

app.get("/api/items", async (req: Request, res: Response) => {
  const items = await sfs.getAllRecordsFromFile();
  res.send(items);
  res.status(200);
});

app.post("/api/item", async (req: Request, res: Response) => {
  const result = await sfs.saveRecord(req.body.data);
  if (result) {
    res.status(200).json("Item added successfully.");
  }
    else {
      res.status(500).json("error occured in adding");
    }
});

app.put("/api/item/:id", async (req: Request, res: Response) => {
  const result = await sfs.updateRecord(req.body.data, Number(req.params.id));
  if (result) res.status(200).json("updated");
  else {
    res.status(500).json("error occured in updating");
  }
});

app.put("/api/item/complete/:id", async (req: Request, res: Response) => {
  const result = await sfs.completeActivity(Number(req.params.id));
  if (result) {
    res.status(200).json("marked as complete");
  } else {
    res.status(500).json("error occured while marking it as complete.");
  }
});

app.delete("/api/item/:id", async (req: Request, res: Response) => {
  const result = await sfs.deleteRecord(Number(req.params.id));
  if (result) {
    res.status(200).json("deleted");
  } else {
    res.status(500).json("error occured while deleing.");
  }
});

app.use(errorHandler);

app.listen(PORT, "localhost", () => {
  console.log(`Listening at Port ${PORT}`);
});
