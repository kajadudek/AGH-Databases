import express, { Express, Request, Response } from "express";
import example from "./endpoints/example";
import connection from "./endpoints/connection";
import connectionsByDate from "./endpoints/connectionsByDate";
import user from "./endpoints/users";
import { jwtCheck } from "./auth";
import env from "./env";
import ticket from "./endpoints/ticket";
import tickets from "./endpoints/tickets";
import updateTicket from "./endpoints/updateTicket";

const app: Express = express();
const port = env.PORT;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/example", jwtCheck, example.get);
app.post("/example", jwtCheck, example.post);
app.get("/connection", connection.get);
app.post("/connection", connection.post);
app.post('/findPaths', connection.findPaths);
app.get("/connectionsByDate", connectionsByDate.get);
app.get("/ticket", jwtCheck, ticket.get);
app.post("/ticket", ticket.post);
app.put("/updateTicket", jwtCheck, updateTicket.updateTicket);
app.delete("/updateTicket", jwtCheck, updateTicket.deleteTicket);
app.get("/tickets", jwtCheck, tickets.get);
app.get("/user", user.get);
app.post("/user", user.post);
app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
