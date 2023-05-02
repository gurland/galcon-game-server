import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import "reflect-metadata";

import {createNewUser, authenticateUser} from "./controllers/auth";

dotenv.config();
const PORT = process.env.PORT;

// Express application routers
const app: Express = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({"message": "Healthcheck OK."});
});

app.post("/users", createNewUser);
app.post("/tokens", authenticateUser);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Socket IO handlers
