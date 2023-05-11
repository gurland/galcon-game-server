import { ExtendedError } from "socket.io/dist/namespace";
import { 
  Socket as SocketIOSocket, 
  Server as SocketIOServer
} from "socket.io";
import {RoomStateChangeEvent, RoomUserJoin} from "./room";
import {User} from "../models/User";


interface ClientToServerEvents {
  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "RoomStateChangeEvent": (event: RoomStateChangeEvent) => void;
  "RoomUserJoin": (event: RoomUserJoin) => void;
  "BatchCollisionEvent": (event: BatchCollisionEvent) => void;
  "PlanetOccupiedEvent": (event: PlanetOccupiedEvent) => void;
}


interface ServerToClientEvents {
  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
}


export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: User;
  roomId: number;
}

export class Server extends SocketIOServer<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
> {}


export class Socket extends SocketIOSocket<
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData
> {}

export type SocketNextListener = (err?: ExtendedError | undefined) => void;
