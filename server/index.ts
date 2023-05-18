import express, { Request, Response } from "express";

let app = express();
const PORT = 8100;

app.get("/", (req: Request, res: Response) => {
    res.status(200).json("ok");
});

app.get("/get-all-records", (req: Request, res: Response) => {
    
})

app.listen(PORT, "localhost", () => {
  console.log(`Listening at Port ${PORT}`);
});
