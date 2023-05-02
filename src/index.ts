import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "reflect-metadata";

import {createNewUser, authenticateUser} from "./controllers/auth";

dotenv.config();

const app: Express = express();
app.use(express.json());

const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send({"message": "Healthcheck OK."});
});

app.post("/users", createNewUser);
app.post("/tokens", authenticateUser);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
