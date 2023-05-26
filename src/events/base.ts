import { ExtendedError } from "socket.io/dist/namespace";
import { 
  Socket as SocketIOSocket, 
  Server as SocketIOServer
} from "socket.io";
import {RoomStateChangeEvent, RoomUserJoin, RoomUserLeave} from "./room";
import {User} from "../models/User";
import {PlanetOccupiedEvent} from "./planet"


interface ClientToServerEvents {
  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "RoomStateChangeEvent": (event: RoomStateChangeEvent) => void;
  "BatchCollisionEvent": (event: BatchCollisionEvent) => void;
  "PlanetOccupiedEvent": (event: PlanetOccupiedEvent) => void;
}


interface ServerToClientEvents {
  "RoomUserJoin": (event: RoomUserJoin) => void;
  "RoomUserLeave": (event: RoomUserLeave) => void;
  "BatchSendEvent": (event: BatchSendEvent) => void;
  "BatchRedirectEvent": (event: BatchRedirectEvent) => void;
  "ErrorEvent": (error: {"message": string}) => void;
}


export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  user: User;
  roomId: number;
}

export class Socket extends SocketIOSocket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {}


export class Server extends SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> {}

export type SocketNextListener = (err?: ExtendedError | undefined) => void;
