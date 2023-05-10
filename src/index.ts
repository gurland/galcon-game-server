import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import "reflect-metadata";

import {createNewUser, authenticateUser} from "./controllers/auth";
import {createNewRoom, getRooms, getRoomById} from "./controllers/rooms";
import {jwtAuthMiddleware} from "./middlewares/auth"



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


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// Socket IO handlers
// const httpServer = createServer(app);

// const io = new Server<
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >();


// const roomsNamespace = io.of("/rooms");

// // SocketIO.Socket<ClientToServerEvents, ServerToClientEvents>

// roomsNamespace.use((socker, next) => {next()});

// roomsNamespace.on("connection", (socket) => {

//   // const roomId = socket.handshake.query.roomId as string;
//   // socket.data.roomId = 1;
//   //
//   // socket.join(roomId);
//   //
//   // // io.to(roomId).emit("");
// });