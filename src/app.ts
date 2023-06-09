import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";

import {createNewUser, authenticateUser} from "./controllers/auth";
import {createNewRoom, getRooms, getRoomById} from "./controllers/rooms";
import {jwtAuthMiddleware} from "./middlewares/auth"
import {Server} from "./events/base";
import {handleInitialConnect} from "./handlers/connect";
import {roomConnectionMiddleware, roomConnectionJWTMiddleware} from "./middlewares/room_connection";
import swaggerUi from "swagger-ui-express";
import * as swaggerDocument from "./openapi.json"


dotenv.config();

// Express application routers
const app: Express = express();
app.use(express.json());
app.use(cors());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


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
io.use(roomConnectionMiddleware);

io.on("connection", handleInitialConnect);

export {
  httpServer,
  io,
  app
}

