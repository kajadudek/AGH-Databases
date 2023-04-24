import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import example from "./endpoints/example";
import { jwtCheck } from "./auth";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/example", jwtCheck, example.get);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
