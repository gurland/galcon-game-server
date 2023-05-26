import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";

import {createNewUser, authenticateUser} from "./controllers/auth";
import {createNewRoom, getRooms, getRoomById} from "./controllers/rooms";
import {jwtAuthMiddleware} from "./middlewares/auth"
import {Server, Socket} from "./events/base";
import {handleInitialConnection} from "./handlers";
import {roomConnectionIDMiddleware, roomConnectionJWTMiddleware} from "./middlewares/room_connection";



dotenv.config();
const PORT = process.env.PORT;

// Express application routers
const app: Express = express();
app.use(express.json());
app.use(cors());

app.get("/api", (req: Request, res: Response) => {
  res.send({"message": "Healthcheck OK."});
});

app.post("/api/users", createNewUser);
app.post("/api/tokens", authenticateUser);

app.post("/api/rooms", jwtAuthMiddleware, createNewRoom);
app.get("/api/rooms", jwtAuthMiddleware, getRooms);

app.get("/api/rooms/:roomId", jwtAuthMiddleware, getRoomById);


// Socket IO handlers
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: true
  }
});


io.use(roomConnectionJWTMiddleware);
io.use(roomConnectionIDMiddleware);

io.on("connection", handleInitialConnection);

httpServer.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
