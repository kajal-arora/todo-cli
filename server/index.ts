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

app.get("/get-all-records", (req: Request, res: Response) => {
  console.log("todo");
});

app.post("/api/item", (req: Request, res: Response) => {
  console.log("body", req.body);
  sfs.saveRecord(req.body.data);
  res.status(200).json("test post");
});

app.put("/api/item/:id", (req: Request, res: Response) => {
  sfs.saveRecord("testwer");
  res.status(200).json("saved");
});

app.listen(PORT, "localhost", () => {
  console.log(`Listening at Port ${PORT}`);
});
