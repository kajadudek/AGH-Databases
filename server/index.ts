import express, { Express, Request, Response } from "express";
import example from "./endpoints/example";
import connection from "./endpoints/connection";
import { jwtCheck } from "./auth";
import env from "./env"


const app: Express = express();
const port = env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/example", jwtCheck, example.get);
app.post("/example",jwtCheck, example.post);
app.get("/connection", jwtCheck, connection.get);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
